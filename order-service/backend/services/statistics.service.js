const moment = require('moment')
const StatusCode = require('../enums/http.status.code')
const Order = require('../models/order')
const isDateValid = require('../helpers/date.valid')
const createError = require('http-errors')
const Area = require('../models/area')

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
            const areas = await Area.find().lean()
            console.log(areas)
            // const data = area.map(value => {

            // })

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Thống kê doanh thu thành công',
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
}

module.exports = new StatisticsService()