const createError = require('http-errors')
const StatusCode = require('../enums/http.status.code')
const OrderOnline = require('../models/online_order')
const StatusOnlineOrder = require('../enums/status.online.order')
const Menu = require('../models/menu')
const calculateShippingFee = require('../helpers/calculate.shippingfee')
const calculateDistance = require('../helpers/calculate.distance')
const Promotion = require('../models/promotion')
const orderService = require('./order.service')
const producerNotification = require('./producer.notification')

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
        if (!menu) throw new Error(`Không tìm thấy đồ ăn hoặc thức uống yêu cầu với mã ${id}, vui lòng thử lại`)
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

            let promotionId = req.body.promotion_id
            let discount = 0

            if (promotionId) {
                promotionId = parseInt(promotionId.toString())
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                const promotion = await Promotion.findOne({ _id: promotionId, status: true, start_at: { $lte: today }, end_at: { $gte: today } }).lean()
                if (!promotion) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy chương trình khuyến mãi, vui lòng kiểm tra lại'))

                if (promotion.condition_apply > subtotalPrice)
                    return next(createError(StatusCode.BadRequest_400, `Hóa đơn của bạn còn thiếu ${new Intl.NumberFormat('vi-VN').format(promotion.condition_apply - subtotalPrice)} để áp dụng chương trình khuyến mãi này`))
        
                //calculate promotion value
                const promotionValue = promotion.promotion_value
                if (promotionValue.toString().includes('%')) {
                    const percentageValue = parseInt(promotionValue.replace('%', ''))
                    discount = Math.round(subtotalPrice / 100 *  percentageValue)
                }
                else {
                    discount = parseInt(promotionValue.toString())
                }
            }

            if (payment_method === 'bank') {
                discount += Math.round(subtotalPrice * 0.05)
            }
            
            const { latitude, longitude } = delivery_information
            if (!latitude || !longitude) return next(createError(StatusCode.BadRequest_400, 'Thiếu thông tin vị trí giao hàng'))
            const MAXIMUM_DISTANCE = process.env.MAXIMUM_DISTANCE || 20
            const distance = calculateDistance(latitude, longitude)
            if (distance > MAXIMUM_DISTANCE)
                return next(createError(StatusCode.BadRequest_400, `Khoảng cách giao hàng cách nhà hàng ${distance}, chúng tôi chỉ nhận giao hàng trong phạm vi ${MAXIMUM_DISTANCE} km`))
            const shippingFee = calculateShippingFee(distance)
            
            const order = await new OrderOnline({
                menu_detail: menuList,
                note: note,
                payment_method: payment_method,
                delivery_information: delivery_information,
                subtotal: subtotalPrice,
                shippingfee: shippingFee,
                total: subtotalPrice + shippingFee - discount,
                order_person: user,
                status: status,
                discount: discount
            }).save()

            if (payment_method === 'cod') {
                orderService.sendPrinterOrderOnline(order)
            }

            producerNotification.sendQueue(null, 'Đơn hàng mới tại website nhà hàng', `Bạn có đơn hàng trực tuyến mới với mã ${order._id.toString()} từ khách hàng qua website nhà hàng`, '', 1)

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Đặt đơn hàng thành công', orderId: order._id.toString(), total: order.total })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    manageOrderAdmin = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page || 1)
            const skip = (10 * page) - 10 //In first page, skip 0 index
            let status = req.query.status
            let orderList = []
            let totalItem = 0
            
            if (!status) {
                orderList = await OrderOnline.find({ status: { $ne: 0 } }).sort({ time: -1 }).select({ __v: 0, order_person: 0, subtotal: 0, discount: 0, surcharge: 0, shippingfee: 0, note: 0, payment_method: 0, delivery_information: 0 }).skip(skip).limit(10) 
                totalItem = await OrderOnline.countDocuments({ status: { $ne: 0 } })
            }
            else {
                status = parseInt(status.toString())
                orderList = await OrderOnline.find({ status: status }).sort({ time: -1 }).select({ __v: 0, order_person: 0, subtotal: 0, discount: 0, surcharge: 0, shippingfee: 0, note: 0, payment_method: 0, delivery_information: 0 }).skip(skip).limit(10) 

                totalItem = await OrderOnline.countDocuments({ status: status })
            }

            const pagination = {
                currentPage: page,
                totalItem: totalItem,
                pagesize: 10,
                totalPage: Math.ceil(totalItem / 10)
            }

            const result = orderList.map(order => {
                return {
                    ...order._doc,
                    status: StatusOnlineOrder[order.status]
                }
            })

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Lấy danh sách đơn hàng thành công', data: result, pagination })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message))
        }
    }

    updateStatusOrder = async (req, res, next) => {
        try {
            const { orderId, status } = req.body

            if (!orderId || !status) return next(createError(StatusCode.BadRequest_400, 'Thiếu thông tin để cập nhật'))

            if (status != 3 && status != 4) return next(createError(StatusCode.BadRequest_400, 'Trạng thái không hợp lệ'))

            const order = await OrderOnline.findOne({ _id: orderId })

            if (!order) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy đơn hàng'))

            if (order.status != 2 && order.status != 3) return next(createError(StatusCode.BadRequest_400, 'Trạng thái hiện tại của đơn hàng không hợp lệ'))

            order.status = status 

            await order.save()

            producerNotification.sendQueue(order.order_person?._id, 'Trạng thái đơn hàng đã cập nhật!', `Đơn hàng ${order._id} của bạn đã cập nhật trạng thái thành ${StatusOnlineOrder[order.status]}`)

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Cập nhật trạng thái đơn hàng thành công' })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message))
        }
    }
}

module.exports = new OrderOnlineService()