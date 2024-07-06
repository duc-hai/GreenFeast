const moment = require('moment')
const StatusCode = require('../enums/http.status.code')
const Order = require('../models/order')
const Area = require('../models/area')
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
                        totalAmount: { $sum: "$total" } 
                    } 
                }
            ])

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
                return { [value['name']]: revenues[index] }
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
}

module.exports = new StatisticsService()