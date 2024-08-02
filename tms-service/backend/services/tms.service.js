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
    registerOrder = async (req, res, next) => {
        try {
            // #swagger.tags = ['Tms']
            // #swagger.summary = 'Create account tms to get order when it created'
            // #swagger.description = 'Create account to get access token as well as website know which tms is perform'
            /*  
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Some informations about order',
                    schema: {
                        "username": "duchai",
                        "password": "123456",
                        "main_url": "http://localhost:3000",
                        "sub_url": "http://localhost:4000"
                    }
                } 

                #swagger.responses[201] = {
                    description: 'Successfully',
                    schema: {
                        status: 'success',
                        message: 'created account tms successfully'
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

            //Body validator
            const { username, password, main_url, sub_url } = req.body

            await new Tms({
                username, password, main_url, sub_url, access_token: generateKey.generateKey(16)
            }).save()

            return res.status(StatusCodeEnum.Created_201).json({
                status: 'success',
                message: 'created account tms successfully'
            })
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error is occured at sendOrder: ${err.message}`])
        }
    }

    updateStatusOrder = async (req, res, next) => {
        try {
            /* #swagger.security = [{
                "apiKeyAuth": []
            }] */
            // #swagger.tags = ['Tms']
            // #swagger.summary = 'Update delivery status'
            // #swagger.description = ''
            /*  
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Thông tin trong body bao gồm trạng thái của đơn hàng, 4: Đang giao hàng, 5: Đã giao hàng, 6: Đã hủy (Giao không thành công), 7: Trả món/Hoàn tiền, order_id là mã vận đơn, delivery_notes is ghi chú khi giao hàng',
                    schema: {
                        status: 4, 
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

    getToken = async (req, res, next) => {
        // #swagger.tags = ['Tms']
        // #swagger.summary = 'Get access token to authorize api'
        // #swagger.description = 'Get token base on username '    
            /*  
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Some informations about account',
                    schema: {
                        "username": "duchai",
                        "password": "123456",
                    }
                } 

                #swagger.responses[200] = {
                    description: 'Successfully',
                    schema: {
                        status: 'success',
                        message: 'get token successfully',
                        data: '59495f06d24d6f1a9ada811eed0ae74d'
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
        try {
            return res.status(StatusCodeEnum.OK_200).json({
                status: 'success',
                message: 'get token successfully',
                data: 'token'
            })
        }
        catch (err) {
            return next([StatusCodeEnum.InternalServerError_500, 'error', `Error is occured at getToken: ${err.message}`])
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
            // #swagger.tags = ['Tms']
            // #swagger.summary = 'Receive new order'
            // #swagger.description = 'Nhận đơn hàng mới đã sẵn sàng từ nhà hàng và shipper sẽ đến lấy hàng. Đơn vị vận chuyển sẽ cấu hình API này để nhận thông tin đơn hàng từ nhà hàng, đường dẫn đến API đã được cấu hình từ trước.'    
            /*  
                #swagger.parameters['body'] = {
                    in: 'body',
                    description: 'Thông tin đơn hàng mà nhà hàng cung cấp',
                    schema: {
                        "delivery_information":{"name":"Đức Hải","phone_number":"01231234","address":"Nguyễn Hữu Thọ","province":"Thành phố Hồ Chí Minh","district":"Quận 7","ward":"Phường Tân Phú","longitude":"106.7261695","latitude":"10.727068"},"order_person":{"_id":"0123456789","name":"Lưu Đức hải"},"_id":"66ac7e2ba4128887d7a8e7d5","menu_detail":[{"_id":1,"name":"Gỏi cuốn sốt đậu phộng","quantity":1,"price":90000},{"_id":3,"name":"Đậu hũ chiên giòn","quantity":1,"price":30000}],"subtotal":120000,"discount":24000,"surcharge":0,"shippingfee":15000,"note":"","total":111000,"time":"2024-08-02T06:33:32.196Z","payment_method":"bank","status":3,"is_rating":false,"__v":0
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