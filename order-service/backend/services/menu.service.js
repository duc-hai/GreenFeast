const Menu = require('../models/menu')
const Area = require('../models/area')
const qrcode = require('qrcode')
const createError = require('http-errors')
const StatusCode = require('../enums/http.status.code')

class MenuService {
    async getAllMenu(req, res, next) {
        try {
            const page = req.query.page || 1
            const perPage = req.query.perPage || 10

            const skip = (perPage * page) - perPage //In first page, skip 0 index

            const menus = await Menu.find({ status: true }).sort({ _id: 1 }).select({ __v: 0 }).skip(skip).limit(perPage) 

            const total = await Menu.countDocuments({ status: true })

            const paginationResult = {
                currentPage: page,
                totalItems: total,
                eachPage: perPage,
                totalPage: Math.ceil(total / perPage)
            }

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy danh sách thành công',
                paginationResult,
                data: menus
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    searchMenu = async (req, res, next) => {
        try {
            const keyword = req.query.keyword
            if (!keyword)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu từ khóa tìm kiếm')) 
            
            const regex = new RegExp(keyword, 'i') //'i' for case-insensitive search
            
            const searchShortKeyword = new RegExp('.*' + keyword.split('').join('.*') + '.*', 'i') // split keyword by .* (it's similar %) to search

            const menus = await Menu.find({
                $or: [
                    { name: { $regex: regex } }, //Search by specific keyword
                    { name: { $regex: searchShortKeyword } }, //Search by short keyword
                ]
            }).sort({ _id: 1 }).select({ __v: 0 })

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Tìm kiếm thành công',
                data: menus
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    async getMenuByCategory (req, res, next) {
        try {
            if (!req.params.id)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu mã danh mục')) 

            const page = req.query.page || 1
            const perPage = req.query.perPage || 10

            const skip = (perPage * page) - perPage //In first page, skip 0 index

            const menus = await Menu.find({ status: true, category_id: req.params.id }).sort({ name: 1 }).select({ __v: 0 }).skip(skip).limit(perPage) 

            const total = await Menu.countDocuments({ status: true, category_id: req.params.id })

            const paginationResult = {
                currentPage: page,
                totalItems: total,
                eachPage: perPage,
                totalPage: Math.ceil(total / perPage)
            }

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy danh sách thành công',
                paginationResult,
                data: menus
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    async getTablesByAreaId (req, res, next) {
        try {
            const areaId = req.params.id

            if (!areaId)
                return next(createError(StatusCode.BadRequest_400, 'Vui lòng cung cấp mã khu vực')) 

            const area = await Area.findOne({ _id: areaId })

            if (!area)
                return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy mã khu vực hoặc khu vực không có bàn nào')) 
            
            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy danh sách bàn thành công',
                data: area?.table_list
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    createQRCode = async (req, res, next) => {
        try {
            const tableId = req.query.table

            if (!tableId)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu dữ liệu bàn'))

            const area = await Area.findOne({ 'table_list._id': tableId })

            if (!area)
                return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy bàn'))

            const table = area?.table_list.find(table => table._id === tableId)

            const hostUrl = process.env.FRONT_END_URL_QRCODE || 'http://localhost:3000'
            const linkToOrder = `${hostUrl}/order/at-restaurant/validate?token=${table.slug}`
            //Create QR Code
            const qrCodeBase64 = await qrcode.toDataURL(linkToOrder)

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Tạo QR bàn thành công',
                data: qrCodeBase64,
                link: linkToOrder
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getMenuDetail = async (req, res, next) => {
        try {
            let id = req.params.id
            if (!id) return next(createError(StatusCode.BadRequest_400, 'Thiếu mã món ăn'))
            const menu = await Menu.findOne({ _id: id, status: true }).lean()
            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Lấy chi tiết món thành công', data: menu })
        }
        catch (error) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
}

module.exports = new MenuService()