const Area = require('../models/area')
const Order = require('../models/order')
const Menu = require('../models/menu')
const Category = require('../models/category')
const Promotion = require('../models/promotion')
const createError = require('http-errors')
const StatusCode = require('../enums/http.status.code')
const pdfService = require('./pdf.service')
const ProcessingTicket = require('../models/processing_ticket')
const clientRedis = require('../config/connect.redis')
const hiddenProperties = require('../config/hidden.properties')
const checkValidation = require('../helpers/check.validation')
const OrderOnline = require('../models/online_order')
const producer = require('./producer.rabbitmq')

class OrderService {
    getMenuById = async id => {
        const menu = await Menu.findOne({ _id: id, status: true }).lean()
        if (!menu) throw new Error('Can not find food or beverage')
        return menu
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

    getUserInfor = headerInfor => {
        const user = JSON.parse(decodeURIComponent(headerInfor))
        if (user.user_type == 1)
            return {
                _id: user._id,
                full_name: `Nhân viên: ${user.full_name}`,
                user_type: user.user_type,
                name: user.full_name
            }
        else 
            return {
                _id: user._id,
                full_name: `Khách hàng: ${user.full_name}`,
                user_type: user.user_type,
                name: user.full_name
            }
    }
    
    getMenuInforFromDB = async menuDataFromBody => {
        let menuData = menuDataFromBody
        //Set price and name for menu
        for (let i = 0; i < menuData.length; i++) {
            const menu = menuData[i]
            const menuFromDB = await Menu.findOne({ _id: menu._id, status: true })
            if (!menuFromDB) 
                throw new Error(`Món ${menu._id} không tồn tại, vui lòng kiểm tra lại`)
                // return next(createError(StatusCode.BadRequest_400, `Món ${menu._id} không tồn tại, vui lòng kiểm tra lại`))
            if (menuFromDB?.discount_price)
                menuData[i].price = menuFromDB?.discount_price
            else
                menuData[i].price = menuFromDB?.price
            menuData[i].name = menuFromDB.name
        }
        return menuData
    }

    orderMenu = async(req, res, next) => {
        try {
            const tableSlug = req.params.tableSlug
            /*
                [
                    {
                        "_id": "1",
                        "quantity": 2,
                        "note": "Ghi chú"
                        //price and name is get by server
                    }
                ]
            */
            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next(createError(StatusCode.BadRequest_400, 'Đường dẫn đặt món không hợp lệ'))

            const menuData = await this.getMenuInforFromDB(req.body)

            const subtotalPrice = menuData.reduce((accumulator, value) => accumulator + value.price * value.quantity, 0)

            let user = { full_name: 'Khách' } //initial by default
            let userId = ''
            let userName = ''

            if (req.headers['user-infor-header']) {
                const userInfor = this.getUserInfor(req.headers['user-infor-header'])
                user.full_name = userInfor.full_name
                user._id = userInfor._id
                if (userInfor.user_type == 2) {
                    userId = userInfor._id
                    userName = userInfor.name
                }
            }

            const table = area?.table_list.find(table => table.slug === tableSlug)

            let getOrderLatest
            let order 

            //Table is available and don't have any menu
            if (table?.status == 0) {
                //Set table is served
                await Area.findOneAndUpdate(
                    { 'table_list.slug': tableSlug },
                    { $set: { 'table_list.$.status': 1 } }
                )
                order = await new Order ({
                    order_detail: [
                        {
                            menu: menuData,
                            time: new Date(),
                            order_person: {
                                _id: user._id,
                                name: user.full_name
                            }
                        }
                    ],
                    subtotal: subtotalPrice,
                    table: table._id,
                    checkin: new Date(),
                    status: false, //Unpaid
                    order_person: {
                        _id: userId,
                        name: userName
                    }
                }).save()

                getOrderLatest = order?.order_detail[0] //Get latest times of order, this is first time then i get 0 index
            }
            //Table is served, this's means we need to add menu the n time
            else if (table?.status == 1) {
                order = await Order.findOne({ table: table._id, status: false }).select({ __v: 0 })

                if (!order) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy order trước đó'))

                if (!order.order_person?._id || !order.order_person?._id == '') {
                    order.order_person = {
                        _id: userId,
                        name: userName
                    }
                }

                order?.order_detail.push({
                    menu: menuData,
                    time: new Date(),
                    order_person: {
                        _id: user._id,
                        name: user.full_name
                    }        
                })

                order.subtotal = order.subtotal + subtotalPrice

                await order.save()

                getOrderLatest = order?.order_detail[order?.order_detail.length - 1] //Get latest times of order
            }
            
            this.sendPrinterFood(order, getOrderLatest)
            this.sendPrinterBaverage(order, getOrderLatest) 

            //Send to role
            producer.sendQueueNotification(null, 'Đơn hàng mới tại nhà hàng', `Món ăn vừa được đặt tại bàn ${table._id}`, '', 1)

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Đặt món thành công' })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
    
    sendPrinterOrderOnline = async (orderOnline) => {
        try {
            const order = {
                table: 'Đơn hàng online'
            }

            //Edit for the right format
            const orderDetail = {
                menu: orderOnline.menu_detail,
                time: orderOnline.time,
                order_person: orderOnline.order_person,
                _id: orderOnline._id
            }

            this.sendPrinterFood(order, orderDetail)
            this.sendPrinterBaverage(order, orderDetail) 
        }
        catch (err) {
            console.error(`Error is occured at storageProcessingTicket: ${err.message}`)
        }
    }

    sendPrinterFood = async (orderMenu, orderDetail) => {
        try {
            /*
                orderDetail:
                {
                    menu: [ { _id: 48, name: 'Đậu hũ', quantity: 2, price: 123, note: 'Không có ghi chú' } ],
                    time: 2024-03-05T07:55:58.709Z,
                    order_person: {
                        _id: new ObjectId('65d752f0b5f9a4ed01060239'),
                        name: 'Nhân viên: Hải'
                    },
                    _id: new ObjectId('65e6d00e36ac1836e4df79d4')
                }
            */

            //Check if menu have or not
            const menuDetailRow = await this.getMenuDetailRow(1, orderDetail)
            if (!menuDetailRow) return //Don't have food 
                
            const ticketFoodUrl = await pdfService.sendPrinterFoodAndBeverage(menuDetailRow, orderDetail, 'Phiếu in bếp', orderMenu.table, 1)

            this.storageProcessingTicket(ticketFoodUrl, 1, orderMenu.table)

            return 
        }
        catch (err) {
            console.error(`Error is occured at sendPrinterFood: ${err.message}`)
        }
    }

    storageProcessingTicket = async (url, ticketType, tableId) => {
        try {
            await new ProcessingTicket({
                url_ticket: url,
                ticket_type: ticketType,
                tableId: tableId,
            }).save()
        }   
        catch (err) {
            console.error(`Error is occured at storageProcessingTicket: ${err.message}`)
        }
    }

    sendPrinterBaverage = async (orderMenu, orderDetail) => {
        try {
            const menuDetailRow = await this.getMenuDetailRow(2, orderDetail)
            if (!menuDetailRow) return //Don't have beverage

            const ticketBeverageUrl = await pdfService.sendPrinterFoodAndBeverage(menuDetailRow, orderDetail, 'Phiếu in pha chế', orderMenu.table, 2)

            this.storageProcessingTicket(ticketBeverageUrl, 2, orderMenu.table)

            return 
        }
        catch (err) {
            console.error(`Error is occured at sendPrinterBaverage: ${err.message}`)
        }
    }

    getMenuDetailRow = async (menuType, orderDetail) => {
        let menuDetailRow = await Promise.all(orderDetail?.menu.map(async value => {
            const menu = await Menu.findOne({ _id: value._id })
        
            if (menu.menu_type != menuType)
                return null
                        
            return [value.name, value.quantity, value.note]
        }))
    
        menuDetailRow = menuDetailRow.filter(value => value !== null)

        if (menuDetailRow.length == 0)
            return null    
        
        return menuDetailRow
    }

    async getOrderInfor (req, res, next) {
        try {
            const tableSlug = req.params.tableSlug

            if (!tableSlug)
                return next([400, 'error', 'Thiếu mã bàn'])

            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next(createError(StatusCode.BadRequest_400, 'Đường dẫn đặt món không hợp lệ'))

            const table = area?.table_list.find(table => table.slug === tableSlug)

            const order = await Order.findOne({ table: table._id, status: false }).select({ __v: 0 })

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Lấy danh sách order thành công', data: order })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    //
    async getPromotions(req, res, next) {
        try {   
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const promotions = await Promotion.find({ 
                status: true,
                start_at: { $lte: today },
                end_at: { $gte: today }
            }).sort({ _id: -1 }).lean();

            return res.status(200).json({
                status: 'success',
                message: 'Lấy khuyến mãi thành công',
                data: promotions
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getMenuDetailRowBill = async (order) => {
        let menuDetailRow = []

        for (let index = 0; index < order?.order_detail.length; index++) {
            for (let element of order?.order_detail[index]?.menu) {
                const menu = await Menu.findOne({ _id: element._id })
                menuDetailRow.push([element.name, element.quantity, new Intl.NumberFormat('vi-VN').format(element.price), new Intl.NumberFormat('vi-VN').format(element.price * element.quantity)])
            }
        }

        return menuDetailRow
    }

    printerBill = async (req, res, next) => {
        try {
            const tableSlug = req.params.tableSlug

            if (!tableSlug)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu mã bàn'))

            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next(createError(StatusCode.BadRequest_400, 'Đường dẫn in hóa đơn không hợp lệ'))

            const table = area?.table_list.find(table => table.slug === tableSlug)

            if (table.status != 1)
                return next(createError(StatusCode.BadRequest_400, 'Bàn chưa có khách'))

            const order = await Order.findOne({ table: table._id, status: false })
            
            const menuDetailRow = await this.getMenuDetailRowBill(order)

            const urlBill = await pdfService.sendPrinterBill(order, 'HÓA ĐƠN TẠM TÍNH', area._id, menuDetailRow)

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'In hóa đơn thành công', data: urlBill })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    moveTable = async (req, res, next) => {
        try {
            const tableFromId = req.query.from
            const tableToId = req.query.to

            if (!tableFromId || !tableToId)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu dữ liệu bàn')) 

            const order = await Order.findOne({ table: tableFromId, status: false }).select({ __v: 0 })
            
            if (!order)
                return next(createError(StatusCode.BadRequest_400, 'Bàn này chưa thực hiện đặt món')) 

            const areaTo = await Area.findOne({ 'table_list._id': tableToId })

            if (!areaTo)
                return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy bàn')) 

            const tableTo = areaTo?.table_list.find(table => table._id === tableToId)

            //Check table is whether available or not  
            if (tableTo?.status != 0) {
                return next(createError(StatusCode.BadRequest_400, 'Bàn chuyển đến đã có người ngồi')) 
            }

            //Move table
            //Set 'table to' is served
            await Area.findOneAndUpdate(
                { 'table_list._id': tableToId },
                { $set: { 'table_list.$.status': 1 } }
            )    

            //Set 'table from' is available
            await Area.findOneAndUpdate(
                { 'table_list._id': tableFromId },
                { $set: { 'table_list.$.status': 0 } }
            )  

            //Update table
            order.table = tableToId
            await order.save()

            producer.sendQueueNotification(null, 'Khách hàng đã chuyển bàn', `Đơn hàng từ bàn ${tableFromId} vừa chuyển sang bàn ${tableToId}`, '', 1)

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Chuyển bàn thành công' })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    async closeTable(req, res, next) {
        try {
            const tableSlug = req.params.tableSlug

            const { note, payment_method } = req.body

            //Depending on whether you pay by cash or transfer, there is an appropriate way to handle it. For transfers, the table is automatically closed, for cash, you call this API. 

            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next(createError(StatusCode.BadRequest_400, 'Đường dẫn đóng bàn không hợp lệ'))

            const table = area?.table_list.find(table => table.slug === tableSlug)

            const order = await Order.findOne({ table: table._id, status: false })
            
            if (!order)
                return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy món trong bàn'))

            const updatedOrder = await Order.findOneAndUpdate({ table: table._id, status: false }, {
                note,
                payment_method,
                status: true,
                checkout: new Date(),
                total: order.subtotal
            }, { returnDocument: 'after' }).lean()

            //Set table is available
            await Area.findOneAndUpdate(
                { 'table_list.slug': tableSlug },
                { $set: { 'table_list.$.status': 0 } }
            )
            
            producer.sendQueueStatistics('offline', updatedOrder)

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Đóng bàn thành công' })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getCategory = async (req, res, next) => {
        try {
            const categories = await Category.find({}).sort({ _id: 1 }).select({ __v: 0 })
            if (!categories)
                return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi khi lấy dữ liệu danh mục'))

            return res.status(200).json({ status: 'success', message: 'Lấy danh sách thành công', data: categories })    
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    //chưa check
    getRevenueByDay = async (req, res, next) => {
        try {
            let fromDate  = req.query.from
            let toDate  = req.query.to
            let result 
            
            if (fromDate && toDate) {
                fromDate = new Date(fromDate) //'2024-01-31'
                toDate = new Date(toDate)

                result = await Order.find({
                    checkout: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                })
            }
            else {
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                result = await Order.find({
                    checkout: {
                        $gte: today,
                        $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000) //Add 1 day from 00:00:00 of current day
                    }
                })
            }

            if (result.length === 0)
                return res.status(200).json({ status: 'success', message: 'Không có dữ liệu phù hợp' })

            const revenue = result.reduce((sum, val) => sum + val.total, 0)
            const discount = result.reduce((sum, val) => sum + val.discount, 0)
            const surcharge = result.reduce((sum, val) => sum + val.surcharge, 0)

            let sum = 0
            //Because there are not too many lists in 1 order, there are usually only 2 or 3 orders, so the algorithm complexity is not high
            //O is not high
            for (let value of result) {
                for (let element of value?.order_detail) {
                    for (let val of element.menu) {
                        sum += val.quantity
                    }
                }
            }

            return res.status(200).json({
                status: 'success',
                message: 'Lấy doanh thu thành công',
                data: {
                    revenue,
                    num_clients: result.length,
                    discount,
                    surcharge,
                    sum_menu: sum
                },
            })  
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    //Lịch sử các order //chưa check
    historyOrder = async (req, res, next) => {
        try {
            let page = req.query?.page || 1

            if (typeof(page) === 'string') {
                page = parseInt(page)
            }

            //Each page has 10 items
            const skip = (10 * page) - 10 //In first page, skip 0 index

            //True means paid
            const orders = await Order.find({ status: true }).sort({ checkout: -1 }).select({ __v: 0, order_detail: 0, discount: 0, surcharge: 0, subtotal: 0, checkin: 0, status: 0, payment_method: 0 }).skip(skip).limit(10) 

            return res.status(200).json({
                status: 'success',
                message: 'Lấy danh sách đơn hàng thành công',
                data: orders
            })  
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    printerBillAgain = async (req, res, next) => {
        try {
            const orderId = req.query.order

            if (!orderId)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu mã hóa đơn'))

            const order = await Order.findOne({ _id: orderId, status: true })

            if (!order)
                return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy đơn hàng'))

            const area = await Area.findOne({ 'table_list._id': order.table })

            const menuDetailRow = await this.getMenuDetailRowBill(order)

            const urlReprinter = await pdfService.sendPrinterBill(order, 'HÓA ĐƠN IN LẠI', area._id, menuDetailRow)

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'In hóa đơn thành công', data: urlReprinter
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    verifyTableSlug = async (req, res, next) => {
        try {
            let { tableSlug } = req.params
            const client = await clientRedis()
            
            if (req?.cookies?.tableSlug) {
                tableSlug = req.cookies.tableSlug
                const tableId = await client.get(tableSlug)
                if (tableId) {
                    return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Đã tìm thấy bàn hợp lệ', data: {
                        _id: tableId,
                        slug: tableSlug
                    }})
                }
            }
                
            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area) 
                return next(createError(StatusCode.BadRequest_400, 'Mã đặt bàn không hợp lệ, vui lòng quét lại QR')) 

            const table = area?.table_list.find(table => table.slug === tableSlug)

            if (!table)
                return next(createError(StatusCode.BadRequest_400, 'Mã đặt bàn không hợp lệ, vui lòng quét lại QR')) 

            //Set to cache
            await client.set(tableSlug, table._id, { EX: 60 * 30 }) //Ex is second
            await client.quit()

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Đã tìm thấy bàn hợp lệ', data: table })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getAllArea = async (req, res, next) => {
        try {
            const areas = await Area.find().select({ table_list: 0, __v: 0 })

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Lấy danh sách khu vực thành công', data: areas })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getProccessingTicket = async (ticketType, page) => {
        try {
            const skip = (10 * page) - 10

            const data = await ProcessingTicket.find({ ticket_type: ticketType }).skip(skip).sort({ updatedAt: -1, createdAt: -1 }).limit(10).select({ __v: 0, ticket_type: 0 }).lean()

            const total = await ProcessingTicket.countDocuments({ ticket_type: ticketType })

            const paginationResult = {
                currentPage: page,
                totalItems: total,
                eachPage: 10,
                totalPage: Math.ceil(total / 10)
            }

            return { data, paginationResult }
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, `Error is occured at getProccessingTicket: ${err.message}`)) 
        }
    }

    getProcessingTicketKitchen = async (req, res, next) => {
        try {
            const page = req.query?.page || 1
            const result = await this.getProccessingTicket(1, page)

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Lấy danh sách phiếu chế biến bếp thành công', paginationResult: result.paginationResult, data: result.data })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getProcessingTicketBar = async (req, res, next) => {
        try {
            const page = req.query || 1
            const result = await this.getProccessingTicket(2, page)

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Lấy danh sách phiếu chế biến quầy bar thành công', paginationResult: result.paginationResult, data: result.data })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    updateProcessingStatus = async (req, res, next) => {
        try {
            if (checkValidation(req) !== null)      
                return next(createError(StatusCode.BadRequest_400, checkValidation(req)))    

            const { orderId, orderDetailId, menuId, status } = req.body

            const order = await Order.findOne({ _id: orderId, status: false })

            if (!order) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy mã hóa đơn hợp lệ')) 

            const orderDetail = order.order_detail.find(value => {
                return value._id == orderDetailId
            })

            if (!orderDetail) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy mã đặt món hợp lệ')) 

            if (menuId) {
                const menu = orderDetail.menu.find(value => {
                    return value._id == menuId
                })
    
                if (!menu) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy mã món hợp lệ')) 
    
                menu.processing_status = status
            }
            else {
                orderDetail.menu.forEach(value => {
                    value.processing_status = status
                })
            }

            await order.save()

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Cập nhật tình trạng lên món thành công' })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    deleteMenuOrder = async (req, res, next) => {
        const { orderId, orderDetailId, menuId } = req.body

        try {
            const order = await Order.findOne({ _id: orderId, status: false })

            if (!order) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy mã hóa đơn hợp lệ')) 

            const orderDetail = order.order_detail.find(value => {
                return value._id == orderDetailId
            })

            if (!orderDetail) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy mã đặt món hợp lệ')) 

            if (!menuId) return next(createError(StatusCode.BadRequest_400, 'Thiếu mã món ăn để hủy'))

            const menuItem = orderDetail.menu.find(item => item._id === menuId)

            if (!menuItem) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy món ăn để hủy')) 
                
            orderDetail.menu = orderDetail.menu.filter(item => item._id !== menuId)
                
            const { price, quantity, name } = menuItem
            const newSubtotal = order.subtotal - (price * quantity)

            order.subtotal = newSubtotal
            order.total = order.total - newSubtotal

            await order.save()

            producer.sendQueueNotification(null, 'Món ăn vừa được hủy', `Món ăn ${name} tại bàn ${order.table} vừa được hủy`, '', 1)
            
            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Hủy món thành công' })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    applyPromotion = async (req, res, next) => {
        try {
            let { promotionId, tableId } = req.body

            if (!promotionId || !tableId)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu mã khuyến mãi hoặc mã đơn hàng'))

            promotionId = parseInt(promotionId.toString())

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const order = await Order.findOne({ table: tableId, status: false })
            if (!order)
                return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy mã hóa đơn hợp lệ'))
            
            const promotion = await Promotion.findOne({ _id: promotionId, status: true, start_at: { $lte: today }, end_at: { $gte: today } }).lean()
            if (!promotion)
                return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy chương trình khuyến mãi, vui lòng kiểm tra lại'))

            // console.log(promotion.condition_apply)
            // console.log(order.subtotal)
            if (promotion.condition_apply > order.subtotal)
                return next(createError(StatusCode.BadRequest_400, `Hóa đơn của bạn còn thiếu ${new Intl.NumberFormat('vi-VN').format(promotion.condition_apply - order.subtotal)} để áp dụng chương trình khuyến mãi này`))

            //calculate promotion value
            const promotionValue = promotion.promotion_value
            if (promotionValue.toString().includes('%')) {
                const percentageValue = parseInt(promotionValue.replace('%', ''))
                const discount = Math.round(order.subtotal / 100 *  percentageValue)
                order.discount = discount
                order.total = order.subtotal - discount + order.surcharge
            }
            else {
                order.discount = parseInt(promotionValue.toString())
                order.total = order.subtotal - promotionValue + order.surcharge
            }

            await order.save()

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Áp dụng khuyến mãi thành công'
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    historyOrderListCustomer = async (req, res, next) => {
        try {
            if (!req.headers['user-infor-header']) 
                return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi với mã JWT'))

            const userInfor = JSON.parse(decodeURIComponent(req.headers['user-infor-header']))
            const orderList = await Order.find({ 'order_person._id': userInfor._id, status: true }).select({ __v: 0, order_detail: 0, status: 0 }).sort({ checkout: -1 })

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy danh sách lịch sử đặt món thành công',
                data: orderList
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    historyOrderDetailCustomer = async (req, res, next) => {
        try {
            const orderId = req.params.id
            const orderDetail = await Order.findOne({ _id: orderId, status: true }).select({ __v: 0, status: 0 })

            if (!orderDetail) 
                return next(createError(StatusCode.BadRequest_400, 'Mã đơn hàng không hợp lệ'))

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy lịch sử đặt món thành công',
                data: orderDetail
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    orderMenuByEmployee = async (req, res, next) => {
        try {
            const tableId = req.body.table
            const menus = req.body.menu

            const area = await Area.findOne({ 'table_list._id': tableId })
            if (!area) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy bàn hợp lệ'))

            const menuData = await this.getMenuInforFromDB(menus)

            const subtotalPrice = menuData.reduce((accumulator, value) => accumulator + value.price * value.quantity, 0)

            let user = { full_name: 'Khách' } //initial by default

            if (req.headers['user-infor-header']) {
                const userInfor = this.getUserInfor(req.headers['user-infor-header'])
                user.full_name = userInfor.full_name
                user._id = userInfor._id
            }

            const table = area?.table_list.find(table => table._id === tableId)

            let getOrderLatest
            let order 

            //Table is available and don't have any menu
            if (table?.status == 0) {
                //Set table is served
                await Area.findOneAndUpdate(
                    { 'table_list._id': tableId },
                    { $set: { 'table_list.$.status': 1 } }
                )
                order = await new Order ({
                    order_detail: [
                        {
                            menu: menuData,
                            time: new Date(),
                            order_person: {
                                _id: user._id,
                                name: user.full_name
                            }
                        }
                    ],
                    subtotal: subtotalPrice,
                    table: table._id,
                    checkin: new Date(),
                    status: false, //Unpaid
                }).save()

                getOrderLatest = order?.order_detail[0] //Get latest times of order, this is first time then i get 0 index
            }
            //Table is served, this's means we need to add menu the n time
            else if (table?.status == 1) {
                order = await Order.findOne({ table: table._id, status: false }).select({ __v: 0 })

                if (!order) return next(createError(StatusCode.BadRequest_400, 'Không tìm thấy order trước đó'))

                order?.order_detail.push({
                    menu: menuData,
                    time: new Date(),
                    order_person: {
                        _id: user._id,
                        name: user.full_name
                    }        
                })

                order.subtotal = order.subtotal + subtotalPrice

                await order.save()

                getOrderLatest = order?.order_detail[order?.order_detail.length - 1] //Get latest times of order
            }
            
            this.sendPrinterFood(order, getOrderLatest)
            this.sendPrinterBaverage(order, getOrderLatest) 

            return res.status(StatusCode.OK_200).json({ status: 'success', message: 'Đặt món thành công' })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
}

module.exports = new OrderService()