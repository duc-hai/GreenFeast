const Area = require('../models/area')
const Order = require('../models/order')
const Menu = require('../models/menu')
const Printer = require('../models/printer')
const Category = require('../models/category')
const PDFDocument = require("pdfkit-table")
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const Promotion = require('../models/promotion')

class OrderService {
    orderMenu = async(req, res, next) => {
        try {
            const tableSlug = req.params.tableSlug
            /*
                [
                    {
                        "_id": "1",
                        "quantity": 2,
                        //price is calculate by server
                        "note": "Ghi chú"
                    }
                ]
            */
            let menuData = req.body

            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next([400, 'error', 'Đường dẫn đặt món không hợp lệ'])

            //Set price for menu
            for (let i = 0; i < menuData.length; i++) {
                const menu = menuData[i]
                const menuFromDB = await Menu.findOne({ _id: menu._id, status: true })
                if (!menuFromDB) 
                    throw new Error('Món không tồn tại, vui lòng kiểm tra lại')
                if (menuFromDB?.discount_price)
                    menuData[i].price = menuFromDB?.discount_price
                else
                    menuData[i].price = menuFromDB?.price
            }

            const subtotalPrice = menuData.reduce((accumulator, value) => accumulator + value.price * value.quantity, 0)

            let user = {
                _id: '65e48397489655124aae2fc1',
                full_name: 'Khách'
            }

            if (req.headers['user-infor-header']) {
                user = JSON.parse(decodeURIComponent(req.headers['user-infor-header']))
                if (user.user_type == 1)
                    user.full_name = `Nhân viên: ${user.full_name}`
                else 
                    user.full_name = `Khách hàng: ${user.full_name}`
            }

            const table = area?.table_list.find(table => table.slug === tableSlug)

            let getOrderLatest
            let orderMenu 

            //Table is available and don't have any menu
            if (table?.status == 0) {
                //Set table is served
                await Area.findOneAndUpdate(
                    { 'table_list.slug': tableSlug },
                    { $set: { 'table_list.$.status': 1 } }
                )
                const order = await new Order ({
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
                    status: false //Unpaid
                }).save()

                getOrderLatest = order?.order_detail[order?.order_detail.length - 1]
                orderMenu = order
            }
            //Table is served, this's means we need to add menu the n time
            else if (table?.status == 1) {
                const order = await Order.findOne({ table: table._id, status: false }).select({ __v: 0 })

                if (!order)
                    return next([400, 'error', 'Không tìm thấy order trước đó'])

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
                
                orderMenu = order
                getOrderLatest = order?.order_detail[order?.order_detail.length - 1]
            }
            
            // this.sendPrinterFood(orderMenu, getOrderLatest)
            // this.sendPrinterBaverage(orderMenu, getOrderLatest)

            const printerFood = await this.sendPrinterFood(orderMenu, getOrderLatest)
            const printerBaverage = await this.sendPrinterBaverage(orderMenu, getOrderLatest) 
           
            if (printerFood)
                res.download(printerFood)
            if (printerBaverage)
                res.download(printerBaverage)

            return res.status(200).json({
                status: 'success',
                message: 'Đặt món thành công',
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    sendPrinterFood = async (orderMenu, orderDetail) => {
        try {
            /*
                orderDetail:
                {
                    menu: [ { _id: 48, quantity: 2, price: 123, note: 'Không có ghi chú' } ],
                    time: 2024-03-05T07:55:58.709Z,
                    order_person: {
                        _id: new ObjectId('65d752f0b5f9a4ed01060239'),
                        name: 'Nhân viên: Hải'
                    },
                    _id: new ObjectId('65e6d00e36ac1836e4df79d4')
                }
            */

            //Check if menu have or not
            let menuDetailRow = await Promise.all(orderDetail?.menu.map(async value => {
                const menu = await Menu.findOne({ _id: value._id })
            
                if (menu.menu_type != 1)
                    return null
                            
                const menuName = menu.name
                return [menuName, value.quantity, value.note]
            }))
        
            menuDetailRow = menuDetailRow.filter(value => value !== null)

            if (menuDetailRow.length == 0)
                return 
                
            const font = __dirname.slice(0, __dirname.lastIndexOf('/')) + '/resources/ARIAL.TTF'

            let doc = new PDFDocument({ margin: 30, size: 'A4' })

            const outputPath = __dirname.slice(0, __dirname.lastIndexOf('/')) + `/resources/kitchen/${orderDetail._id}-1.pdf`

            doc.pipe(fs.createWriteStream(outputPath))

            doc
                .font(font)
                .fontSize(18)
                .text('Phiếu in bếp', { align: 'center' })
                .moveDown()

            doc
            .fontSize(18)
            .text(`Bàn: ${orderMenu.table}`, { align: 'center' })
            .moveDown()

            doc.fontSize(10).text(`Mã: ${orderDetail._id}`)
            doc.moveDown() 

            doc.fontSize(10).text(`${orderDetail?.order_person?.name}`)
            doc.moveDown()

            const dateTime = this.formatDateTime(orderDetail.time)

            doc.fontSize(10).text(`Thời gian: ${dateTime}`)
            doc.moveDown()
            
            const printer = await Printer.findOne({ printer_type: 2 })
            if (printer) {
                doc.fontSize(10).text(`Máy in: ${printer.name}`)
                doc.moveDown()
            }

            ;(async function createTable() {
                try {
                    // table
                    const table = { 
                        // title: "Title",
                        // subtitle: "Subtitle",
                        headers: [ "Món chế biến", "Số lượng", "Ghi chú" ],
                        // rows: [
                        //     [ "Australia", "12%", "+1.12%" ],
                        //     [ "France", "67%", "-0.98%" ],
                        //     [ "England", "33%", "+4.44%" ],
                        // ],
                        rows: menuDetailRow
                    }

                    await doc.table(table, { 
                        prepareHeader: () => doc.font(font).fontSize(10),    
                        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                            doc.font(font).fontSize(10)
                        },
                        columnsSize: [ 200, 100, 230 ],
                    })

                    doc.end()
                }
                catch (err) {
                    console.error(`Error is occured: ${err.message}`)
                }
            })()

            // //Upload to cloud
            // cloudinary.config({
            //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            //     api_key: process.env.CLOUDINARY_API_KEY,
            //     api_secret: process.env.CLOUDINARY_API_SECRET
            // })

            // const result = await cloudinary.uploader.upload(outputPath, { public_id: `${orderDetail._id}-1` })

            // return result.secure_url
            return outputPath
        }
        catch (err) {
            console.error(`Error is occured: ${err.message}`)
        }
    }

    sendPrinterBaverage = async (orderMenu, orderDetail) => {
        try {
            /*
                orderDetail:
                {
                    menu: [ { _id: 48, quantity: 2, price: 123, note: 'Không có ghi chú' } ],
                    time: 2024-03-05T07:55:58.709Z,
                    order_person: {
                        _id: new ObjectId('65d752f0b5f9a4ed01060239'),
                        name: 'Nhân viên: Hải'
                    },
                    _id: new ObjectId('65e6d00e36ac1836e4df79d4')
                }
            */

            //Check if menu have or not
            let menuDetailRow = await Promise.all(orderDetail?.menu.map(async value => {
                const menu = await Menu.findOne({ _id: value._id })
        
                if (menu.menu_type != 2)
                    return null
                    
                const menuName = menu.name
                return [menuName, value.quantity, value.note]
            }))
    
            menuDetailRow = menuDetailRow.filter(value => value !== null)
    
            if (menuDetailRow.length == 0)
                return    

            const font = __dirname.slice(0, __dirname.lastIndexOf('/')) + '/resources/ARIAL.TTF'

            let doc = new PDFDocument({ margin: 30, size: 'A4' })

            const outputPath = __dirname.slice(0, __dirname.lastIndexOf('/')) + `/resources/kitchen/${orderDetail._id}-2.pdf`

            doc.pipe(fs.createWriteStream(outputPath))

            doc
                .font(font)
                .fontSize(18)
                .text('Phiếu in pha chế', { align: 'center' })
                .moveDown()

            doc
            .fontSize(18)
            .text(`Bàn: ${orderMenu.table}`, { align: 'center' })
            .moveDown()

            doc.fontSize(10).text(`Mã: ${orderDetail._id}`)
            doc.moveDown() 

            doc.fontSize(10).text(`${orderDetail?.order_person?.name}`)
            doc.moveDown()

            const dateTime = this.formatDateTime(orderDetail.time)

            doc.fontSize(10).text(`Thời gian: ${dateTime}`)
            doc.moveDown()
            
            const printer = await Printer.findOne({ printer_type: 3 })
            if (printer) {
                doc.fontSize(10).text(`Máy in: ${printer.name}`)
                doc.moveDown()
            }

            ;(async function createTable() {
                try {
                    // table
                    const table = { 
                        // title: "Title",
                        // subtitle: "Subtitle",
                        headers: [ "Món chế biến", "Số lượng", "Ghi chú" ],
                        // rows: [
                        //     [ "Australia", "12%", "+1.12%" ],
                        //     [ "France", "67%", "-0.98%" ],
                        //     [ "England", "33%", "+4.44%" ],
                        // ],
                        rows: menuDetailRow
                    }

                    await doc.table(table, { 
                        prepareHeader: () => doc.font(font).fontSize(10),    
                        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                            doc.font(font).fontSize(10)
                        },
                        columnsSize: [ 200, 100, 230 ],
                    })

                    doc.end()
                }
                catch (err) {
                    console.error(`Error is occured: ${err.message}`)
                }
            })()

            //Upload to cloud
            // cloudinary.config({
            //     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            //     api_key: process.env.CLOUDINARY_API_KEY,
            //     api_secret: process.env.CLOUDINARY_API_SECRET
            // })

            // const result = await cloudinary.uploader.upload(outputPath, { public_id: `${orderDetail._id}-1` })

            // return result.secure_url
            return outputPath
        }
        catch (err) {
            console.error(`Error is occured: ${err.message}`)
        }
    }

    formatDateTime = (dateTime) => {
        try {
            const day = dateTime.getDate()
            const month = dateTime.getMonth() + 1
            const year = dateTime.getFullYear()

            const hours = dateTime.getHours()
            const minutes = dateTime.getMinutes()
            const seconds = dateTime.getSeconds()

            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
        }
        catch (err) {
            console.error(`Error occured: ${err.message}`)
        }
    }

    async getOrderInfor (req, res, next) {
        try {
            const tableSlug = req.params.tableSlug

            if (!tableSlug)
                return next([400, 'error', 'Thiếu mã bàn'])

            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next([400, 'error', 'Đường dẫn đặt món không hợp lệ'])

            const table = area?.table_list.find(table => table.slug === tableSlug)

            const order = await Order.findOne({ table: table._id, status: false }).select({ __v: 0 })

            return res.status(200).json({
                status: 'success',
                message: 'Lấy danh sách order thành công',
                data: order
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    async getPromotions(req, res, next) {
        try {   
            const promotions = await Promotion.find({ status: true })

            return res.status(200).json({
                status: 'success',
                message: 'Lấy khuyến mãi thành công',
                data: promotions
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    printerBill = async (req, res, next) => {
        try {
            const tableSlug = req.params.tableSlug

            if (!tableSlug)
                return next([400, 'error', 'Thiếu mã bàn'])

            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next([400, 'error', 'Đường dẫn in hóa đơn không hợp lệ'])

            const table = area?.table_list.find(table => table.slug === tableSlug)

            if (table.status != 1)
                return next([400, 'error', 'Bàn chưa có khách'])

            const order = await Order.findOne({ table: table._id, status: false })

            const font = __dirname.slice(0, __dirname.lastIndexOf('/')) + '/resources/ARIAL.TTF'

            let doc = new PDFDocument({ margin: 30, size: 'A4' })

            const outputPath = __dirname.slice(0, __dirname.lastIndexOf('/')) + `/resources/bills/${order._id}.pdf`

            doc.pipe(fs.createWriteStream(outputPath))

            doc
                .font(font)
                .fontSize(18)
                .text('HÓA ĐƠN TẠM TÍNH', { align: 'center' })
                .moveDown()

            doc
                .fontSize(12)
                .text(`Mã: ${order._id}`, { align: 'center' })
                .moveDown()

            doc.fontSize(10).text(`Bàn: ${order.table}`)
            doc.moveDown() 

            doc.fontSize(10).text(`${order?.order_detail[0]?.order_person?.name}`)
            doc.moveDown() 

            const printer = await Printer.findOne({ printer_type: 1, area_id: area._id })
            if (printer) {
                doc.fontSize(10).text(`Máy in: ${printer.name}`)
                doc.moveDown()
            }

            const dateTime = this.formatDateTime(order.checkin)

            doc.fontSize(10).text(`Giờ vào: ${dateTime}`)
            doc.moveDown()
            
            let menuDetailRow = []

            for (let index = 0; index < order?.order_detail.length; index++) {
                for (let element of order?.order_detail[index]?.menu) {
                    const menu = await Menu.findOne({ _id: element._id })
                    const menuName = menu.name

                    menuDetailRow.push([menuName, element.quantity, element.price, (element.price * element.quantity)])
                }
            }

            ;(async function createTable() {
                try {
                    const table = { 
                        // title: "Title",
                        // subtitle: "Subtitle",
                        headers: [ "Món chế biến", "Số lượng", "Đơn giá", "Thành tiền" ],
                        // rows: [
                        //     [ "Australia", "12%", "+1.12%" ],
                        //     [ "France", "67%", "-0.98%" ],
                        //     [ "England", "33%", "+4.44%" ],
                        // ],
                        rows: menuDetailRow
                    }

                    await doc.table(table, { 
                        prepareHeader: () => doc.font(font).fontSize(10),    
                        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                            doc.font(font).fontSize(10)
                        },
                        columnsSize: [ 200, 100, 100, 130 ],
                    })

                    doc.end()
                }
                catch (err) {
                    console.error(`Error is occured: ${err.message}`)
                }
            })()

            doc.fontSize(12).text(`Tổng số tiền: ${order.subtotal}`, { align: 'right' })
            doc.moveDown()

            res.download(outputPath)

            return res.status(200).json({
                status: 'success',
                message: 'In hóa đơn thành công'
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    moveTable = async (req, res, next) => {
        try {
            const tableFromId = req.query.from
            const tableToId = req.query.to

            if (!tableFromId || !tableToId)
                return next([400, 'error', 'Thiếu dữ liệu bàn'])

            const order = await Order.findOne({ table: tableFromId, status: false }).select({ __v: 0 })
            
            if (!order)
                return next([400, 'error', 'Bàn này chưa thực hiện đặt món'])

            const areaTo = await Area.findOne({ 'table_list._id': tableToId })

            if (!areaTo)
                return next([400, 'error', 'Không tìm thấy bàn'])

            const tableTo = areaTo?.table_list.find(table => table._id === tableToId)

            //Check table is whether available or not  
            if (tableTo?.status != 0) {
                return next([400, 'error', 'Bàn chuyển đến đã có người ngồi'])
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

            return res.status(200).json({
                status: 'success',
                message: 'Chuyển bàn thành công'
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    async closeTable(req, res, next) {
        try {
            const tableSlug = req.params.tableSlug

            const { note, payment_method } = req.body

            const area = await Area.findOne({ 'table_list.slug': tableSlug })

            if (!area)
                return next([400, 'error', 'Đường dẫn đóng bàn không hợp lệ'])

            const table = area?.table_list.find(table => table.slug === tableSlug)

            const order = await Order.findOne({ table: table._id, status: false })
            
            if (!order)
                return next([400, 'error', 'Đã xảy ra lỗi với thực đơn'])

            await Order.updateOne({ table: table._id, status: false }, {
                note,
                payment_method,
                status: true,
                checkout: new Date(),
                total: order.subtotal
            })

            //Set table is available
            await Area.findOneAndUpdate(
                { 'table_list.slug': tableSlug },
                { $set: { 'table_list.$.status': 0 } }
            )        

            return res.status(200).json({
                status: 'success',
                message: 'Đóng bàn thành công'
            })
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }

    getCategory = async (req, res, next) => {
        try {
            const categories = await Category.find({}).sort({ _id: 1 }).select({ __v: 0 })
            if (!categories)
                return next([400, 'error', 'Đã xảy ra lỗi khi lấy dữ liệu danh mục'])

            return res.status(200).json({
                status: 'success',
                message: 'Lấy danh sách thành công',
                data: categories
            })    
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }
}

module.exports = new OrderService()