const PDFDocument = require("pdfkit-table")
const cloudinary = require('cloudinary').v2
const path = require('path')
const fs = require('fs')
const Printer = require('../models/printer')
const formatDateTime = require('../helpers/format.datetime')
const cloudinaryConfig = require('../config/cloudinary.config')

class PdfService {
    sendPrinterFoodAndBeverage = async (menuDetailRow, orderDetail, ticketType, tableName, menuType) => {
        try {
            const font = path.dirname(__dirname) + '/resources/ARIAL.TTF'

            let doc = new PDFDocument({ margin: 30, size: 'A4' })

            const outputPath = path.dirname(__dirname) + `/resources/kitchen/${orderDetail._id}-${menuType}.pdf`

            doc.pipe(fs.createWriteStream(outputPath))

            doc
                .font(font)
                .fontSize(18)
                .text(ticketType, { align: 'center' })
                .moveDown()

            doc
            .fontSize(18)
            .text(`Bàn: ${tableName}`, { align: 'center' })
            .moveDown()

            doc.fontSize(10).text(`Mã: ${orderDetail._id}`)
            doc.moveDown() 

            doc.fontSize(10).text(`${orderDetail?.order_person?.name}`)
            doc.moveDown()

            const dateTime = formatDateTime(orderDetail.time)

            doc.fontSize(10).text(`Thời gian: ${dateTime}`)
            doc.moveDown()
            
            const printer_type = menuType == 1 ? 2 : 3 // menutype: 1 is food, 2 is beverage, printertype: 2 is food, 3 is beverage
            const printer = await Printer.findOne({ printer_type: printer_type })

            if (printer) {
                doc.fontSize(10).text(`Máy in: ${printer.name}`)
                doc.moveDown()
            }

            ;(async function createTable() {
                try {
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
            
            const publicId = `${orderDetail._id}-${menuType}`
            
            return await this.uploadPdfCloudinary(outputPath, publicId)
        }
        catch (err) {
            console.error(`Error occured at sendPrinterFoodAndBeverage: ${err.message}`)
        }
    }

    uploadPdfCloudinary = async (outputPath, publicId) => {
        //Upload to cloud
        cloudinary.config(cloudinaryConfig)
        const result = await cloudinary.uploader.upload(outputPath, { public_id: publicId })

        return result.secure_url
    }

    sendPrinterBill = async (order, ticketType, areaId, menuDetailRow) => {
        try {
            const font = path.dirname(__dirname) + '/resources/ARIAL.TTF'

            let doc = new PDFDocument({ margin: 30, size: 'A4' })

            const outputPath = path.dirname(__dirname) + `/resources/bills/${order._id}.pdf`

            doc.pipe(fs.createWriteStream(outputPath))

            doc
                .font(font)
                .fontSize(18)
                .text(ticketType, { align: 'center' })
                .moveDown()

            doc
                .fontSize(12)
                .text(`Mã: ${order._id}`, { align: 'center' })
                .moveDown()

            doc.fontSize(10).text(`Bàn: ${order.table}`)
            doc.moveDown() 

            doc.fontSize(10).text(`${order?.order_detail[0]?.order_person?.name}`)
            doc.moveDown() 

            const printer = await Printer.findOne({ printer_type: 1, area_id: areaId })
            if (printer) {
                doc.fontSize(10).text(`Máy in: ${printer.name}`)
                doc.moveDown()
            }
            const dateTime = formatDateTime(order.checkin)

            doc.fontSize(10).text(`Giờ vào: ${dateTime}`)
            doc.moveDown()

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

            doc.fontSize(12).text(`Tổng số tiền: ${new Intl.NumberFormat('vi-VN').format(order.subtotal)}`, { align: 'right' })
            doc.moveDown()

            const publicId = order._id + (Math.floor(Math.random() * 1000) + 1)
            
            return await this.uploadPdfCloudinary(outputPath, publicId)
        }
        catch (err) {
            console.error(`Error occured at sendPrinterBill: ${err.message}`)
        }
    }
}

module.exports = new PdfService()