const createError = require('http-errors')
const StatusCode = require('../enums/http.status.code')
const OrderOnline = require('../models/online_order')
const StatusOnlineOrder = require('../enums/status.online.order')
const Menu = require('../models/menu')

class OrderOnlineService {
    validatorBodyMenuOnline = (menus, payment_method, delivery_information) => {
        if (menus.length == undefined || menus.length == 0) return 'Thiếu thông tin thực đơn'
        if (payment_method == '') return 'Thiếu thông tin thanh toán'
        if (!delivery_information || !delivery_information.name || !delivery_information.phone_number || !delivery_information.address) return 'Thiếu thông tin giao hàng'
        return true;
    }

    getInformationMenuList = async menus => {
        const menuList = await Promise.all(menus.map(async value => {
            const menu = await this.getMenuById(value._id)
            return {
                ...value, name: menu.name, price: menu.price
            }
        }))
        return menuList
    }

    historyOrderOnlineList = async (req, res, next) => {
        try {
            if (!req.headers['user-infor-header']) 
                return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi với mã JWT'))

            const userInfor = JSON.parse(decodeURIComponent(req.headers['user-infor-header']))
            const orderList = await OrderOnline.find({ 'order_person._id': userInfor._id, status: { $ne: 0 } }).select({ __v: 0, order_person: 0, subtotal: 0, discount: 0, surcharge: 0, shippingfee: 0, note: 0, payment_method: 0, delivery_information: 0 }).sort({ time: -1 })

            const result = orderList.map(order => {
                return {
                    ...order._doc,
                    status: StatusOnlineOrder[order.status]
                }
            })

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy danh sách lịch sử đặt món thành công',
                data: result
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getMenuById = async id => {
        const menu = await Menu.findOne({ _id: id, status: true }).lean()
        if (!menu) throw new Error('Can not find food or beverage')
        return menu
    }

    historyOrderOnlineDetail = async (req, res, next) => {
        try {
            // if (!req.headers['user-infor-header']) 
            //     return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi với mã JWT'))
            // const userInfor = JSON.parse(decodeURIComponent(req.headers['user-infor-header']))

            const orderId = req.params.id
            const orderDetail = await OrderOnline.findOne({ _id: orderId, status: { $ne: 0 } }).select({ __v: 0 })

            if (!orderDetail) 
                return next(createError(StatusCode.BadRequest_400, 'Mã đơn hàng không hợp lệ'))

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy lịch sử đặt món thành công',
                data: {
                    ...orderDetail._doc,
                    status: StatusOnlineOrder[orderDetail.status]
                }
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    orderMenuOnline = async (req, res, next) => {
        try {
            const menus = req.body.menu
            const note = req.body.note || ''
            const payment_method = req.body.payment_method
            const delivery_information = req.body.delivery
            const status = payment_method === 'bank' ? 0 : 1 

            const checkValidator = this.validatorBodyMenuOnline(menus, payment_method, delivery_information)
            if (checkValidator !== true) return next(createError(StatusCode.BadRequest_400, checkValidator))

            const menuList = await this.getInformationMenuList(menus)

            const subtotalPrice = menuList.reduce((accumulator, value) => accumulator + value.price * value.quantity, 0)

            let user = {} //initial by default

            if (req.headers['user-infor-header']) {
                const userInfor = JSON.parse(decodeURIComponent(req.headers['user-infor-header']))
                user.name = userInfor.full_name
                user._id = userInfor._id
            }
            
            const order = await new OrderOnline({
                menu_detail: menuList,
                note: note,
                payment_method: payment_method,
                delivery_information: delivery_information,
                subtotal: subtotalPrice,
                total: subtotalPrice,
                order_person: user,
                status: status
            }).save()

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Đặt đơn hàng thành công', orderId: order._id.toString(), total: order.total })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
}

module.exports = new OrderOnlineService()