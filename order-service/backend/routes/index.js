const express = require('express')
const errorHandler = require('../middlewares/error.handler')
const menuService = require('../services/menu.service')
const orderService = require('../services/order.service')
const router = express.Router()

router.get('/menu/get-list', menuService.getAllMenu)
router.get('/menu/get-by-category/:id', menuService.getMenuByCategory)
router.get('/tables/:id', menuService.getTablesByAreaId)
router.get('/menu/search', menuService.searchMenu)
router.get('/create-qr', menuService.createQRCode)

router.post('/:tableSlug', orderService.orderMenu)
router.get('/view-order/:tableSlug', orderService.getOrderInfor)
router.get('/promotion', orderService.getPromotions)
router.post('/close/:tableSlug', orderService.closeTable)
router.get('/print-bill/:tableSlug', orderService.printerBill)
router.get('/category/get-all', orderService.getCategory)
router.get('/move-table', orderService.moveTable)
router.get('/get-revenue', orderService.getRevenueByDay)
router.get('/history', orderService.historyOrder)
router.get('/history/print-bill', orderService.printerBillAgain)
router.get('/verify-slug/:tableSlug', orderService.verifyTableSlug)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router