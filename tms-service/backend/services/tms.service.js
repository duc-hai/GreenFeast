const crypto = require('crypto') 
const moment = require('moment') //moment is a widely used JavaScript library for handling and displaying dates and times, more customizable than Date
const Order = require('../models/order')
const Tms = require('../models/tms')
const mongoose = require('mongoose')
const StatusCodeEnum = require('../enums/http.status.code')
const StatusOrder = require('../enums/status.order')
const generateKey = require('../helpers/generate.key')
const producer = require('./producer.rabbitmq')

class TmsService {
    updateStatusOrder = async (req, res, next) => {
        try {
            /* #swagger.security = [{
                "apiKeyAuth": []
            }] */
            // #swagger.tags = ['Order']
            // #swagger.summary = 'Update delivery status'
            // #swagger.description = ''
            /*  
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Thông tin trong body bao gồm trạng thái của đơn hàng, 4: Đang giao hàng, 5: Đã giao hàng, 6: Đã hủy (Giao không thành công), 7: Trả món/Hoàn tiền, order_id là mã vận đơn, delivery_notes is ghi chú khi giao hàng',
                    schema: {
                        status: 5, 
                        order_id: "666458f9d8f8927ab0cbf5f4", 
                        delivery_notes: "Giao hang thanh cong"
                    }
                } 

                #swagger.responses[200] = {
                    description: 'Successfully',
                    schema: {
                        status: 'success',
                        message: 'update status order successfully'
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
            const { status, order_id, delivery_notes } = req.body
            const statusOrderList = Object.keys(StatusOrder)
            if (!statusOrderList.includes(status.toString()))
                return next([StatusCodeEnum.BadRequest_400, 'error', `Status is not valid`])

            await Order.updateOne({ _id: order_id, isDeleted: false, isActive: true }, {
                status: status,
                delivery_notes: delivery_notes
            })

            producer.sendQueueOrderUpdate(order_id, status, delivery_notes || '')

            return res.status(StatusCodeEnum.OK_200).json({
                status: 'success',
                message: 'update status order successfully'
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

    getOrderById = async (req, res, next) => {
        try {
            // #swagger.tags = ['Tms']
            // #swagger.summary = 'Get order information by id'
            // #swagger.description = 'Get order information by id'    
            /*  
                #swagger.parameters['id'] = { 
                    description: 'Order id',
                    schema: '665fe8ccc5a09967910db414'
                }

                #swagger.responses[200] = {
                    description: 'Successfully',
                    schema: {
                        status: 'success',
                        message: 'get order successfully',
                        data: {
                            "delivery_information": {
                                "name": "Jane Smith",
                                "phone_number": "0987654321",
                                "district": "District 3",
                                "ward": "Ward 5",
                                "street": "5678 Maple Avenue"
                            },
                            "_id": "666458f9d8f8927ab0cbf5f4",
                            "menu_detail": [
                                {
                                    "_id": 1,
                                    "name": "Margherita Pizza",
                                    "quantity": 1
                                },
                                {
                                    "_id": 2,
                                    "name": "Greek Salad",
                                    "quantity": 2
                                },
                                {
                                    "_id": 3,
                                    "name": "Chocolate Cake",
                                    "quantity": 3
                                }
                            ],
                            "shipping_fee": 20,
                            "note": "Ring the doorbell twice",
                            "payment_method": "Cash",
                            "content": "Birthday celebration order",
                            "distance": "3 km",
                            "cod_amount": 150,
                            "status": 0,
                        }
                    }
                }

                #swagger.responses[500] = {
                    description: 'Error',
                    schema: {
                        status: 'success',
                        message: 'some errors'
                    }
                }
            */
            return res.status(200).json({
                status: 'success',
                message: 'get order successfully',
                data: await Order.findOne({ _id: req.params.id })
           })
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error is occured at getOrderById: ${err.message}`])
        }
    }

    getOrderList = async (req, res, next) => {
        try {
            // #swagger.tags = ['Tms']
            // #swagger.summary = 'Get order list'
            // #swagger.description = 'Get order list'    
            /*  
                #swagger.parameters['id'] = { 
                    description: 'Order id',
                    schema: '665fe8ccc5a09967910db414'
                }

                #swagger.responses[200] = {
                    description: 'Successfully',
                    schema: {
                        status: 'success',
                        message: 'get order successfully',
                        data: [
                            {
                                    "delivery_information": {
                                        "name": "Jane Smith",
                                        "phone_number": "0987654321",
                                        "district": "District 3",
                                        "ward": "Ward 5",
                                        "street": "5678 Maple Avenue"
                                    },
                                    "_id": "666458f9d8f8927ab0cbf5f4",
                                    "menu_detail": [
                                        {
                                            "_id": 1,
                                            "name": "Margherita Pizza",
                                            "quantity": 1
                                        },
                                        {
                                            "_id": 2,
                                            "name": "Greek Salad",
                                            "quantity": 2
                                        },
                                        {
                                            "_id": 3,
                                            "name": "Chocolate Cake",
                                            "quantity": 3
                                        }
                                    ],
                                    "shipping_fee": 20,
                                    "note": "Ring the doorbell twice",
                                    "payment_method": "Cash",
                                    "content": "Birthday celebration order",
                                    "distance": "3 km",
                                    "cod_amount": 150,
                                    "status": 0,
                                }            
                        ]
                    }
                }

                #swagger.responses[500] = {
                    description: 'Error',
                    schema: {
                        status: 'success',
                        message: 'some errors'
                    }
                }
                    */
                return res.status(200).json({
                    status: 'success',
                    message: 'get order successfully',
                    data: await Order.findOne({ _id: req.params.id })
               })    
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error is occured at getOrderList: ${err.message}`])
        }
    }

    newOrder = async (req, res, next) => {
        try {
            // #swagger.tags = ['Receive Order']
            // #swagger.summary = 'Receive new order'
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
}

module.exports = new TmsService()