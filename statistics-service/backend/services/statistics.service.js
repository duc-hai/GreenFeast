const moment = require('moment')
const StatusCode = require('../enums/http.status.code')
const Order = require('../models/order')
const Area = require('../models/area')
const OnlineOrder = require('../models/online_order')
const isDateValid = require('../helpers/date.valid')
const createError = require('http-errors')

class StatisticsService {
   getNumberOfCustomer = async (req, res, next) => {
        try {
            let from = req.query.from || moment().startOf('day').toISOString()
            let to = req.query.to || moment().endOf('day').toISOString()
            if (!isDateValid(from) || !isDateValid(to))
                return next(createError(StatusCode.BadRequest_400, 'Định dạng ngày tháng không hợp lệ')) 
            from = new Date(from)
            to = new Date(to)
            const data = await Order.aggregate([
                { 
                    $match: { 
                        checkout: { 
                            $gte: from,
                            $lte: to
                        }, 
                    } 
                },
                { 
                    $group: { 
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$checkout" },
                        },
                        count: { $sum: 1 } 
                    } 
                }
            ])

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy số lượt khách thành công',
                data: data
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
   }

    getRevenue =  async (req, res, next) => {
        try {
            let from = req.query.from || moment().startOf('day').toISOString()
            let to = req.query.to || moment().endOf('day').toISOString()
            const form = req.query.form || 'all'
            if (form != 'online' && form != 'offline' && form != 'all')
                return next(createError(StatusCode.BadRequest_400, 'Hình thức thống kê phải là online hoặc offline')) 
            if (!isDateValid(from) || !isDateValid(to))
                return next(createError(StatusCode.BadRequest_400, 'Định dạng ngày tháng không hợp lệ')) 
            from = new Date(from)
            to = new Date(to)
            let data = []
            
            switch (form) {
                case 'offline':
                    data = await this.getRevenueOrderOffline(from, to)
                    break
                case 'online':
                    data = await this.getRevenueOrderOnline(from, to)
                    break
                case 'all':
                    const revenueOffline = await this.getRevenueOrderOffline(from, to)
                    const revenueOnline = await this.getRevenueOrderOnline(from, to)
                    data = this.mergeTwoRevenueArray(revenueOffline, revenueOnline)
                    break
            }

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Thống kê doanh thu thành công',
                data: data
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    mergeTwoRevenueArray = (revenueA, revenueB) => {
        let arrayResult = [...revenueA]

        revenueB.forEach(value => {
            let found = false
            for (let element of arrayResult) {
                if (element._id === value._id) {
                    element.totalAmount += value.totalAmount
                    found = true
                    break
                }
            }
            if (!found) arrayResult.push(value)
        })
        arrayResult.sort((a, b) => new Date(a._id) - new Date(b._id)) //Sort by time (_id)
        return arrayResult
    }

    getRevenueOrderOnline = async (from, to) => {
        return await OnlineOrder.aggregate([
            { 
                $match: { 
                    time: { 
                        $gte: from,
                        $lte: to
                    }, 
                } 
            },
            { 
                $group: { 
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$time" },
                    },
                    totalAmount: { $sum: "$total" } 
                } 
            }
        ])
    }

    getRevenueOrderOffline = async (from, to) => {
        return await Order.aggregate([
            { 
                $match: { 
                    checkout: { 
                        $gte: from,
                        $lte: to
                    }, 
                } 
            },
            { 
                $group: { 
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$checkout" },
                    },
                    totalAmount: { $sum: "$total" } 
                } 
            }
        ])
    }

    getArea = async (req, res, next) => {
        try {
            const date = req.query.date || moment().startOf('day').toISOString()
            if (!isDateValid(date))
                return next(createError(StatusCode.BadRequest_400, 'Định dạng ngày tháng không hợp lệ'))
            const startDay = new Date(new Date(date).setHours(0, 0, 0, 0))
            const endDay = new Date(new Date(date).setHours(23, 59, 59, 999))
           
            const orders = await Order.find({ 
                checkout: { $lte: endDay, $gte: startDay },
            }).lean()

            const areas = await Area.find().lean()

            // console.log(areas)
            // console.log(orders)

            let revenues = Array(areas.length).fill(0) //This array corresponds to the revenue in the areas list

            for (let element of orders) {
                for (let index in areas) {
                    const value = areas[index]
                    if (value.table_list.includes(element.table)) {
                        revenues[index] += element.total
                        break
                    }
                }
            }

            const responseData = areas.map((value, index) => {
                return { area: value['name'], value: revenues[index] }
            })

            // console.log(responseData)
            
            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Thống kê doanh thu theo khu vực thành công',
                data: responseData
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getMenu = async (req, res, next) => {
        try {
            let from = req.query.from || moment().startOf('day').toISOString()
            let to = req.query.to || moment().endOf('day').toISOString()
            if (!isDateValid(from) || !isDateValid(to))
                return next(createError(StatusCode.BadRequest_400, 'Định dạng ngày tháng không hợp lệ')) 
            from = new Date(from)
            to = new Date(to)

            const orders = await Order.find({ 
                checkout: { $lte: to, $gte: from },
            }).lean()

            let menuId = []
            let menuName = []

            for (let element of orders) {
                for (let value of element.menu_detail) {
                    if (!menuId.includes(value._id)) {
                        menuId.push(value._id)
                        menuName.push({
                            name: value.name,
                            quantity: value.quantity,
                            totalPrice: value.quantity * value.price
                        })
                    }
                    else {
                        const index = menuId.indexOf(value._id)
                        menuName[index] = {
                            name: value.name,
                            quantity: menuName[index].quantity + value.quantity,
                            totalPrice: menuName[index].totalPrice + value.quantity * value.price
                        }
                    }
                }
            }

            //Sort by revenue 
            menuName.sort((a, b) => b.totalPrice - a.totalPrice)

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Thống kê doanh thu theo món ăn thành công',
                data: menuName
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    queryRevenueOfflinePayment = async (from, to, payment_method) => {
        const orders = await Order.find({
            checkout: { $gte: from, $lte: to },
            payment_method: payment_method
        })

        const totalAmount = orders.reduce((acc, order) => acc + order.total, 0)
        const count = orders.length

        return {
            totalAmount,
            count
        }
    }

    queryRevenueOnlinePayment = async (from, to, payment_method) => {
        const orders = await OnlineOrder.find({
            time: { $gte: from, $lte: to },
            payment_method: payment_method
        })

        const totalAmount = orders.reduce((acc, order) => acc + order.total, 0)
        const count = orders.length

        return {
            totalAmount,
            count
        }
    }

    getRevenueByPaymentMethod = async (req, res, next) => {
        try {
            let from = req.query.from || moment().startOf('day').toISOString()
            let to = req.query.to || moment().endOf('day').toISOString()
            if (!isDateValid(from) || !isDateValid(to))
                return next(createError(StatusCode.BadRequest_400, 'Định dạng ngày tháng không hợp lệ')) 
            from = new Date(from)
            to = new Date(to)

            const payment_methods = [
                { _id: 'cash', name: 'Tiền mặt tại nhà hàng', type: 'offline' },
                { _id: 'transfer',name: 'Chuyển khoản tại nhà hàng', type: 'offline' },
                { _id: 'cod', name: 'Thanh toán khi nhận hàng', type: 'online' },
                { _id: 'bank', name: 'Thanh toán online trực tuyến', type: 'online'},
            ]

            const result = await Promise.all(payment_methods.map(async value => {
                let totalAmount, count
                if (value.type === 'offline') 
                    ({ totalAmount, count } = await this.queryRevenueOfflinePayment(from, to, value._id))
                else
                    ({ totalAmount, count } = await this.queryRevenueOnlinePayment(from, to, value._id))
                return {
                    name: value.name, totalAmount, count
                }
            }))

            const sumAmount = result.reduce((acc, val) => acc + val.totalAmount, 0)
            const sumCount = result.reduce((acc, val) => acc + val.count, 0)

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Thống kê doanh thu theo phương thức thanh toán thành công',
                data: result,
                total: {
                    sum: sumAmount,
                    count: sumCount
                }
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getStatisticsByCustomer = async (req, res, next) => {
        try {
            const form = req.query.form
            const schema = form === 'online' ? 'online_order' : 'order'
            const result = await require(`../models/${schema}`).aggregate([
                {
                    $match: {
                        $and: [
                            { 'order_person._id': { $ne: null } },
                            { 'order_person._id': { $ne: '' } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: '$order_person._id',
                        totalAmount: { $sum: '$total' },
                        name: { $first: '$order_person.name' }
                    }
                },
                {
                    $sort: { totalAmount: -1 }
                },
                {
                    $limit: 20
                }
            ])

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Thống kê theo khách hàng thành công',
                data: result
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
}

module.exports = new StatisticsService()