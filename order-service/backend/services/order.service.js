const Area = require('../models/area')
const Order = require('../models/order')
const Menu = require('../models/menu')

class OrderService {
    async orderMenu (req, res, next) {
        try {
            const tableSlug = req.params.tableSlug
            /*
                [
                    {
                        "_id": "1",
                        "quantity": 2,
                        //price is calculate by server
                        "note": "Ghi chú"
                    }
                ]
            */
            let menuData = req.body

            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next([400, 'error', 'Đường dẫn đặt món không hợp lệ'])

            //Set price for menu
            for (let i = 0; i < menuData.length; i++) {
                const menu = menuData[i]
                const menuFromDB = await Menu.findOne({ _id: menu._id, status: true })
                if (!menuFromDB) 
                    throw new Error('Món không tồn tại, vui lòng kiểm tra lại')
                if (menuFromDB?.discount_price)
                    menuData[i].price = menuFromDB?.discount_price
                else
                    menuData[i].price = menuFromDB?.price
            }

            const subtotalPrice = menuData.reduce((accumulator, value) => accumulator + value.price, 0)

            let user = {
                _id: '65e48397489655124aae2fc1',
                full_name: 'Khách'
            }

            if (req.headers['user-infor-header']) {
                user = JSON.parse(decodeURIComponent(req.headers['user-infor-header']))
                if (user.user_type == 1)
                    user.full_name = `Nhân viên: ${user.full_name}`
                else 
                    user.full_name = `Khách hàng: ${user.full_name}`
            }

            const table = area?.table_list.find(table => table.slug === tableSlug)

            //Table is available and don't have any menu
            if (table?.status == 0) {
                //Set table is served
                await Area.findOneAndUpdate(
                    { 'table_list.slug': tableSlug },
                    { $set: { 'table_list.$.status': 1 } }
                )
                await new Order ({
                    order_detail: [
                        {
                            menu: menuData,
                            time: new Date(),
                            order_person: {
                                _id: user._id,
                                name: user.full_name
                            }
                        }
                    ],
                    subtotal: subtotalPrice,
                    table: table._id,
                    checkin: new Date(),
                    status: false //Unpaid
                }).save()
            }
            //Table is served, this's means we need to add menu the n time
            else if (table?.status == 1) {
                const order = await Order.findOne({ table: table._id, status: false }).select({ __v: 0 })

                if (!order)
                    return next([400, 'error', 'Không tìm thấy order trước đó'])

                order?.order_detail.push({
                    menu: menuData,
                    time: new Date(),
                    order_person: {
                        _id: user._id,
                        name: user.full_name
                    }        
                })

                order.subtotal = order.subtotal + subtotalPrice

                await order.save()
            }

            return res.status(200).json({
                status: 'success',
                message: 'Đặt món thành công',
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    async getOrderInfor (req, res, next) {
        try {
            const tableSlug = req.params.tableSlug

            if (!tableSlug)
                return next([400, 'error', 'Thiếu mã bàn'])

            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next([400, 'error', 'Đường dẫn đặt món không hợp lệ'])

            const table = area?.table_list.find(table => table.slug === tableSlug)

            const order = await Order.findOne({ table: table._id, status: false }).select({ __v: 0 })

            return res.status(200).json({
                status: 'success',
                message: 'Lấy danh sách order thành công',
                data: order
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }
}

module.exports = new OrderService()