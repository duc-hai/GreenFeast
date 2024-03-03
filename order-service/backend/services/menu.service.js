const Menu = require('../models/menu')
const Area = require('../models/area')

class MenuService {
    async getAllMenu(req, res, next) {
        try {
            const page = req.query.page || 1
            const perPage = req.query.perPage || 10

            const skip = (perPage * page) - perPage //In first page, skip 0 index

            const menus = await Menu.find({ status: true }).sort({ name: 1 }).select({ __v: 0 }).skip(skip).limit(perPage) 

            const total = await Menu.countDocuments({ status: true })

            const paginationResult = {
                currentPage: page,
                totalItems: total,
                eachPage: perPage,
                totalPage: Math.ceil(total / perPage)
            }

            return res.status(200).json({
                status: 'success',
                message: 'Lấy danh sách thành công',
                paginationResult,
                data: menus
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    async getMenuByCategory (req, res, next) {
        try {
            if (!req.params.id)
                return next([400, 'error', 'Thiếu mã danh mục'])

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

            return res.status(200).json({
                status: 'success',
                message: 'Lấy danh sách thành công',
                paginationResult,
                data: menus
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    async getTablesByAreaId (req, res, next) {
        try {
            const areaId = req.params.id

            if (!areaId)
                return next([400, 'error', 'Vui lòng cung cấp mã khu vực'])

            const area = await Area.findOne({ _id: areaId })

            if (!area)
                return next([400, 'error', 'Không tìm thấy mã khu vực hoặc khu vực không có bàn nào'])
            
            return res.status(200).json({
                status: 'success',
                message: 'Lấy danh sách bàn thành công',
                data: area?.table_list
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }
}

module.exports = new MenuService()