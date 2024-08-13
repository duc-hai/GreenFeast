const crypto = require('crypto') 
const moment = require('moment') //moment is a widely used JavaScript library for handling and displaying dates and times, more customizable than Date
const Order = require('../models/order')
const mongoose = require('mongoose')
const StatusCodeEnum = require('../enums/http.status.code')
const StatusOrder = require('../enums/status.order')
const generateKey = require('../helpers/generate.key')
const producer = require('./producer.rabbitmq')
const baseHiddenProperties = require('../config/base.hidden.properties')
const showProperties = require('../config/show.properties.orderlist')
const consumerService = require('./consumer.rabbitmq')
const isDateValid = require('../helpers/date.valid')

class TmsService {
    updateStatusOrder = async (req, res, next) => {
        try {
            /* #swagger.security = [{
                "apiKeyAuth": []
            }] */
            // #swagger.tags = ['Order']
            // #swagger.summary = 'Cập nhật trạng thái đơn hàng'
            // #swagger.description = ''
            /*  
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Thông tin trong body bao gồm trạng thái của đơn hàng, 4: Đang giao hàng, 5: Đã giao hàng, 6: Đã hủy (Giao không thành công), 7: Giao không thành công. Order_id là mã vận đơn, delivery_notes is ghi chú khi giao hàng. Lưu ý rằng chỉ cập nhật được đơn hàng với trạng thái hiện tại là Đã sẵn sàng hoặc Đang giao hàng. Đối với trạng thái đang giao hàng, yêu cầu đơn vị vận chuyển cung cấp thông tin người giao hàng.',
                    schema: {
                        status: {
                            "@enum": [4, 5, 6, 7]
                        }, 
                        order_id: "666458f9d8f8927ab0cbf5f4", 
                        delivery_notes: "Giao hang thanh cong",
                        delivery_person: {
                            name: "Nguyễn Văn A",
                            phone: "0329232212"
                        }
                    }
                } 

                #swagger.responses[200] = {
                    description: 'Successfully',
                    schema: {
                        status: 'success',
                        message: 'Update status order successfully'
                    }
                }

                #swagger.responses[400] = {
                    description: 'Error',
                    schema: {
                        status: 'error',
                        message: 'Status is not valid'
                    }
                }
            */
            const { status, order_id, delivery_notes, delivery_person } = req.body
            const statusOrderList = Object.keys(StatusOrder)
            if (!statusOrderList.includes(status.toString())) return next([StatusCodeEnum.BadRequest_400, 'error', `Status is not valid`])

            const order = await Order.findOneAndUpdate({ _id: order_id, status: { $in: [2, 3] }}, {
                status: status,
                delivery_notes: delivery_notes,
                delivery_person: delivery_person
            })

            if (!order) return next([StatusCodeEnum.NotFound_404, 'error', `Order not found or current status is not valid`])

            producer.sendQueueOrderUpdate(order_id, status, delivery_notes, delivery_person || '')

            return res.status(StatusCodeEnum.OK_200).json({
                status: 'success',
                message: 'Update status order successfully'
            })
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error is occured at updateStatusOrder: ${err.message}`])
        }
    }

    login = async (req, res, next) => {
        try {
            // #swagger.tags = ['Auth']
            // #swagger.summary = 'Lấy token để xác thực với hệ thống'
            // #swagger.description = 'Sử dụng username và password được cung cấp bởi hệ thống và đăng nhập, kết quả sẽ trả về một cặp khóa gồm access token (chính là API key) và Refresh token. API Key sẽ có thời hạn truy cập trong 10 tiếng, nếu hết hạn có thể dùng refresh token để lấy lại token mới để sử dụng.'    
            /*  
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Some informations about account',
                    schema: {
                        "username": "tmsforshipping",
                        "password": "secretpasswordfortms"
                    }
                } 

                #swagger.responses[200] = {
                    description: 'Successfully',
                    schema: {
                        "status": "success",
                        "message": "Login successfully",
                        "data": {
                            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRtc2ZvcnNoaXBwaW5nIiwiaWF0IjoxNzIzNDU1NjQ0LCJleHAiOjE3MjM0OTE2NDR9.7AIJZ_W-BHMDzV7-SfsIx6SP-15pNY8jAO2LwS4xF2k",
                            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRtc2ZvcnNoaXBwaW5nIiwiaWF0IjoxNzIzNDU1NjQ0LCJleHAiOjE3MjYwNDc2NDR9.gWXzwQbsJAIpvVXVWy_0KAo2WGDpdE9wh-Oa7UCmubo"
                        }
                    }
                }

                #swagger.responses[400] = {
                    description: 'Lỗi nếu đăng nhập không thành công. Status code sẽ bao gồm 400 hoặc 500 nếu lỗi và 200 nếu thành công.',
                    schema: {
                        "status": "error",
                        "message": "Username or password is not correct"
                    }
                }
            */
            return res.status(StatusCodeEnum.InternalServerError_500).json({
                status: 'error',
                message: 'This API for test'
            })
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error: ${err.message}`])
        }
    }

    refreshToken = async (req, res, next) => {
        try {
            // #swagger.tags = ['Auth']
            // #swagger.summary = 'Lấy token mới từ refresh token'
            // #swagger.description = 'Sử dụng refresh token để lấy API Key mới'    
            /*  
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Some informations about account',
                    schema: {
                        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRtc2ZvcnNoaXBwaW5nIiwiaWF0IjoxNzIzNDU1NjQ0LCJleHAiOjE3MjYwNDc2NDR9.gWXzwQbsJAIpvVXVWy_0KAo2WGDpdE9wh-Oa7UCmubo"
                    }
                } 

                #swagger.responses[200] = {
                    description: 'Successfully',
                    schema: {
                        "status": "success",
                        "message": "Get new access token successfully",
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRtc2ZvcnNoaXBwaW5nIiwiaWF0IjoxNzIzNDU1NjYwLCJleHAiOjE3MjM0OTE2NjB9.j_COyZelJt1kRivI2uy5S-2iXZI3nyfDXcxnrg0iSik"
                    }
                }

                #swagger.responses[400] = {
                    description: 'Lỗi nếu token sai. Status code sẽ bao gồm 400 hoặc 500 nếu lỗi và 200 nếu thành công.',
                    schema: {
                        "status": "error",
                        "message": "invalid signature"
                    }
                }
            */
            return res.status(StatusCodeEnum.InternalServerError_500).json({
                status: 'error',
                message: 'This API for test'
            })
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error: ${err.message}`])
        }
    }

    newOrder = async (req, res, next) => {
        try {
            // #swagger.tags = ['Receive Order']
            // #swagger.summary = 'Nhận đơn hàng mới từ nhà hàng'
            // #swagger.description = 'Nhận đơn hàng mới đã sẵn sàng từ nhà hàng và shipper sẽ đến lấy hàng. Đơn vị vận chuyển sẽ cấu hình API này để nhận thông tin đơn hàng từ nhà hàng, đường dẫn đến API đã được cấu hình từ trước và nhà hàng sẽ gọi đến API này khi có đơn hàng mới.'    
            /*  
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Thông tin đơn hàng mà nhà hàng cung cấp. Trong đó, _id là mã đơn hàng.',
                    schema: {
                        menu_detail: [ { _id: 2, name: "Chả giò", quantity: 3 } ],
                        shipping_fee: 26500,
                        note: "Không có",
                        payment_method: "Thanh toán khi nhận hàng",
                        delivery_information: {
                            name: "Đức Hải",
                            phone_number: "0123459634",
                            district: "Quận 1",
                            ward: "Phường Bến Nghé",
                            street: "11 Tôn Đức Thắng"
                        },
                        delivery_notes: "",
                        _id: "66b9ff46f24cf10d49099eab",
                        cod_amount: 218500,
                        status: 3,
                        total: 218500
                    }
                } 

                #swagger.responses[200] = {
                    description: 'Thành công. Đơn vị vận chuyển phải cấu hình phản hồi với mã phản hồi 200 (statusCode) nếu thành công và các mã lỗi khác để nhà hàng xác nhận thông tin rằng đơn vị vận chuyển đã nhận đơn hàng.',
                    schema: {
                        statusCode: 200, 
                        message: 'The shipping unit has received the order'
                    }
                }
            */
            return res.status(StatusCodeEnum.OK_200).json({
                status: 'success',
                message: 'API này dùng để minh họa'
            })
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error is occured at newOrder: ${err.message}`])
        }
    }

    resendOrder = async (req, res, next) => {
        try {
            // #swagger.ignore = true
            const orderId = req.body.orderId
            const order = await Order.findOne({ _id: orderId })
            if (!order) next([StatusCodeEnum.BadRequest_400, 'error', `Không tìm thấy đơn hàng`])
            if (order.send_tms == true) next([StatusCodeEnum.BadRequest_400, 'error', `Đơn hàng đã được gửi trước đó`])

            const result = await consumerService.sendNewOrderToTms(order)
            if (result == false) next([StatusCodeEnum.BadRequest_400, 'error', `Không thể gửi đơn hàng cho đơn vị vận chuyển`])

            return res.status(StatusCodeEnum.OK_200).json({
                status: 'success',
                message: 'Gửi lại đơn hàng thành công'
            })
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error occured: ${err.message}`])
        }
    }

    getOrderWithStatus = async (req, res, next) => {
        try {
            /* #swagger.security = [{
                "apiKeyAuth": []
            }] */
            // #swagger.tags = ['Order']
            // #swagger.summary = 'Lấy danh sách đơn hàng theo trạng thái'
            // #swagger.description = 'Đơn vị vận chuyển sẽ lấy được thông tin các đơn hàng tại các trạng thái khác nhau để hiển thị cũng như đối chiếu với dữ liệu của đơn hàng vận chuyển thực tế.'    
            /*  
                #swagger.parameters['status'] = {
                    in: 'query',
                    description: 'Các trạng thái của đơn hàng. Bao gồm: 3: Đơn hàng đã sẵn sàng, 4: Đang giao hàng, 5: Đã giao hàng, 6: Đã hủy, 7: Giao không thành công. Nếu không truyền tham số này thì mặc định là lấy tất cả đơn hàng ở tất cả trạng thái.',
                    type: 'number',
                    enum: [3, 4, 5, 6, 7],
                    required: false
                }

                #swagger.parameters['page'] = {
                    in: 'query',
                    description: 'Số trang của danh sách muốn hiển thị. Mỗi trang sẽ có 10 đơn hàng, nếu không truyền tham số này thì mặc định số trang là 1.',
                    type: 'number',
                    required: false
                }

                #swagger.responses[200] = {
                    description: 'Thành công. Send_tms là trạng thái của đơn hàng đó đã được gửi cho đơn vị vận chuyển chưa. Pagination là kết quả phân trang, thông tin của đơn hàng là data.',
                    schema: {
                        "status": "success",
                        "message": "Get orders successfully",
                        "data": [
                            {
                            "_id": "66ba1a9a76e2eff6a203e532",
                            "shipping_fee": 26500,
                            "total": 218500,
                            "cod_amount": 218500,
                            "status": 3,
                            "send_tms": true,
                            "createdAt": "2024-08-12T14:22:18.574Z"
                            }
                        ],
                        "pagination": {
                            "currentPage": 1,
                            "totalItems": 1,
                            "pagesize": 10,
                            "totalPage": 1
                        }
                    }
                }
            */
            const page = req.query.page || 1
            const pagesize = 10
            const skip = (pagesize * page) - pagesize
            const status = req.query.status

            let order, total
            if (status) {
                order = await Order.find({ status: status }).sort({ createdAt: -1 }).select(showProperties).skip(skip).limit(pagesize)
                total = await Order.countDocuments({ status: status })
            }
            else {
                order = await Order.find().sort({ createdAt: -1 }).select(showProperties).skip(skip).limit(pagesize)
                total = await Order.countDocuments()
            }

            const pagination = {
                currentPage: page,
                totalItems: total,
                pagesize: pagesize,
                totalPage: Math.ceil(total / pagesize)
            }

            return res.status(StatusCodeEnum.OK_200).json({
                status: 'success',
                message: 'Get orders successfully',
                data: order, 
                pagination
            })
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error occured: ${err.message}`])
        }
    }

    getDetailOrder = async (req, res, next) => {
        try {
            /* #swagger.security = [{
                "apiKeyAuth": []
            }] */
            // #swagger.tags = ['Order']
            // #swagger.summary = 'Lấy chi tiết của đơn hàng'
            // #swagger.description = 'Lấy chi tiết của đơn hàng dựa trên mã đơn hàng'    
            /*  
                // #swagger.parameters['id'] = { in: 'path', schema: "66ba1a9a76e2eff6a203e532", required: 'true' }

                #swagger.responses[200] = {
                    description: 'Thành công.',
                    schema: {
                        "status": "success",
                        "message": "Get order detail successfully",
                        "data": {
                            "delivery_information": {
                            "name": "Test Socket",
                            "phone_number": "111",
                            "district": "Quận 1",
                            "ward": "Phường Bến Nghé",
                            "street": "1"
                            },
                            "_id": "66ba1a9a76e2eff6a203e532",
                            "menu_detail": [
                                {
                                    "_id": 2,
                                    "name": "Chả giò",
                                    "quantity": 3
                                }
                            ],
                            "shipping_fee": 26500,
                            "note": "1",
                            "total": 218500,
                            "payment_method": "Thanh toán khi nhận hàng",
                            "cod_amount": 218500,
                            "status": 3,
                            "delivery_notes": "",
                            "send_tms": true,
                            "createdAt": "2024-08-12T14:22:18.574Z"
                        }
                    }
                }

                #swagger.responses[404] = {
                    description: 'Lỗi không tìm thấy đơn hàng.',
                    schema: {
                    "status": "error",
                    "message": "Order not found"
                    }
                }
            */
            const orderId = req.params.id
            if (!mongoose.Types.ObjectId.isValid(orderId)) return next([StatusCodeEnum.NotFound_404, 'error', `Order id is not valid`])

            const order = await Order.findOne({ _id: orderId }).select(baseHiddenProperties)
            if (!order) return next([StatusCodeEnum.NotFound_404, 'error', `Order not found`])

            return res.status(StatusCodeEnum.OK_200).json({
                status: 'success',
                message: 'Get order detail successfully',
                data: order, 
            }) 
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error occured: ${err.message}`])
        }
    }

    queryReturn = async (req, res, next) => {
        try {
            /* #swagger.security = [{
                "apiKeyAuth": []
            }] */
            // #swagger.tags = ['Order']
            // #swagger.summary = 'Truy vấn số tiền thu hộ và đối chiếu để gửi lại tiền đơn hàng cho nhà hàng'
            // #swagger.description = 'Mỗi ngày, đơn vị vận chuyển sẽ giao hàng đến khách hàng. Đến cuối ngày, đơn vị vận chuyển sẽ đối chiếu số tiền nhận được từ đơn hàng (với phương thức thanh toán khi nhận hàng - cod) với API thống kê này của nhà hàng. Nếu trùng khớp, đơn vị vận chuyển sẽ trừ đi tiền ship và gửi lại số tiền thực nhận của đơn hàng cho bên nhà hàng. Cách tính như sau: lấy tổng giá trị đơn hàng trong ngày (phương thức cod), trừ đi tổng số tiền ship (của cả cod và bank), sẽ ra số tiền mà đơn vị vận chuyển phải gửi lại cho nhà hàng trong ngày hôm đó. Hệ thống này chỉ thống kê số tiền, không quản lý các hóa đơn chuyển tiền từ đơn vị vận chuyển. Lưu ý rằng chỉ áp dụng cho các đơn hàng giao hàng thành công, nếu đơn hàng giao không thành công thì shipper hoàn trả đơn về cho nhà hàng và nhà hàng chịu phí đơn hàng đó cũng như phí ship sẽ do đơn vị vận chuyển chịu.'    
            /*  
                #swagger.parameters['date'] = {
                    in: 'query',
                    description: 'Thông tin của ngày muốn truy vấn. Định dạng là yyyy-mm-dd. Nếu không truyền thông tin này thì mặc định lấy của ngày hôm nay',
                    type: 'string',
                    schema: '2024-08-13',
                    required: false
                }

                #swagger.responses[200] = {
                    description: 'Thành công. Total là tổng số tiền thu hộ (bao gồm cả ship). Shippingfee là số tiền ship (bao gồm cả cod và bank). Count là số lượng đơn hàng đã giao thành công trong ngày. Return là số tiền mà đơn vị vận chuyển phải gửi lại cho nhà hàng trong ngày hôm đó. Cách tính là lấy tổng số tiền thu hộ trừ đi phí ship của ngày hôm đó.',
                    schema: {
                        "status": "success",
                        "message": "Query return amount successfully",
                        "data": {
                            "total": 218500,
                            "shippingfee": 26500,
                            "count": 1,
                            "return": 192000
                        }
                    }
                }

                #swagger.responses[400] = {
                    description: 'Lỗi sai định dạng ngày.',
                    schema: {
                        "status": "error",
                        "message": "Format date is not valid"
                    }
                }
            */
            const date = req.query.date || moment().startOf('day').toISOString()
            
            if (!isDateValid(date)) return next([StatusCodeEnum.BadRequest_400, 'error', `Format date is not valid`])
                    
            const startDay = new Date(new Date(date).setHours(0, 0, 0, 0))
            const endDay = new Date(new Date(date).setHours(23, 59, 59, 999))

            const queryOrderByDate = { createdAt: { $lte: endDay, $gte: startDay }, status: 5 }
            const result = await Order.aggregate([
                { $match: queryOrderByDate },
                {
                    $group: {
                        _id: null, //Specifies that we do not need to group by a specific field but simply calculate the sum of the fields across all valid records.
                        total: { $sum: "$cod_amount" }, //calulate sum of 'total' column
                        shippingfee: { $sum: "$shipping_fee" },
                        count: { $sum: 1 } //count records
                    }
                }
            ])

            const totalSum = result.length > 0 ? result[0].total : 0;
            const shippingFee = result.length > 0 ? result[0].shippingfee : 0;
            const count = result.length > 0 ? result[0].count : 0;
            const data = {
                total: totalSum, //Tổng số tiền thu hộ (bao gồm cả ship)
                shippingfee: shippingFee, //Số tiền ship (bao gồm cả cod và bank)
                count: count, //Số lượng đơn hàng đã giao thành công trong ngày
                return: totalSum - shippingFee
            }

            return res.status(StatusCodeEnum.OK_200).json({
                status: 'success',
                message: 'Query return amount successfully',
                data: data, 
            }) 
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error occured: ${err.message}`])
        }
    }

    statisticsQueryReturn = async (req, res, next) => {
        // #swagger.ignore = true
        await this.queryReturn(req, res, next)
    }
}

module.exports = new TmsService()