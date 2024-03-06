const express = require('express')
const errorHandler = require('../middlewares/error.handler')
const menuService = require('../services/menu.service')
const orderService = require('../services/order.service')


const router = express.Router()

router.get('/order/menu/get-list', menuService.getAllMenu)
router.get('/order/menu/get-by-category/:id', menuService.getMenuByCategory)
router.post('/order/:tableSlug', orderService.orderMenu)
router.get('/order/tables/:id', menuService.getTablesByAreaId)
router.get('/order/view-order/:tableSlug', orderService.getOrderInfor)
router.get('/order/promotion', orderService.getPromotions)
router.post('/order/close/:tableSlug', orderService.closeTable)
router.get('/order/print-bill/:tableSlug', orderService.printerBill)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router