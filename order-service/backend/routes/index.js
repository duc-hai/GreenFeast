const express = require('express')
const errorHandler = require('../middlewares/error.handler')
const menuService = require('../services/menu.service')
const orderService = require('../services/order.service')
const router = express.Router()

router.get('/menu/get-list', menuService.getAllMenu)
router.get('/menu/get-by-category/:id', menuService.getMenuByCategory)

router.get('/menu/search', menuService.searchMenu)

router.post('/:tableSlug', orderService.orderMenu)
router.get('/view-order/:tableSlug', orderService.getOrderInfor)
// router.get('/promotion', orderService.getPromotions)

router.get('/print-bill/:tableSlug', orderService.printerBill)
router.get('/category/get-all', orderService.getCategory)


router.get('/verify-slug/:tableSlug', orderService.verifyTableSlug)

// For admin & emoployee
router.get('/order/tables/:id', menuService.getTablesByAreaId)
router.get('/order/move-table', orderService.moveTable)
router.post('/order/close/:tableSlug', orderService.closeTable)
router.get('/order/create-qr', menuService.createQRCode)
router.get('/order/get-revenue', orderService.getRevenueByDay)
router.get('/order/history', orderService.historyOrder)
router.get('/order/history/print-bill', orderService.printerBillAgain)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router