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
                    description: 'Thông tin trong body bao gồm trạng thái của đơn hàng, 4: Đang giao hàng, 5: Đã giao hàng, 6: Đã hủy (Giao không thành công), 7: Trả món/Hoàn tiền. Order_id là mã vận đơn, delivery_notes is ghi chú khi giao hàng. Lưu ý rằng chỉ cập nhật được đơn hàng với trạng thái hiện tại là Đã sẵn sàng hoặc Đang giao hàng. Đối với trạng thái đang giao hàng, yêu cầu đơn vị vận chuyển cung cấp thông tin người giao hàng.',
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
                    description: 'Các trạng thái của đơn hàng. Bao gồm: 3: Đơn hàng đã sẵn sàng, 4: Đang giao hàng, 5: Đã giao hàng, 6: Đã hủy (Giao không thành công), 7: Trả món/Hoàn tiền. Nếu không truyền tham số này thì mặc định là lấy tất cả đơn hàng ở tất cả trạng thái.',
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
}

module.exports = new TmsService()