const express = require('express')
const errorHandler = require('../middlewares/error.handler')
const menuService = require('../services/menu.service')
const orderService = require('../services/order.service')
const orderOnlineService = require('../services/order.online.service')
const addressService = require('../services/address.service')
const router = express.Router()
const validation = require('../validations/body.validation')

router.get('/menu/get-list', menuService.getAllMenu)
router.get('/menu/get-by-category/:id', menuService.getMenuByCategory)
router.get('/menu/search', menuService.searchMenu)

//Online module
router.post('/online', orderOnlineService.orderMenuOnline)
router.get('/online/history-list', orderOnlineService.historyOrderOnlineList)
router.get('/online/history-detail/:id', orderOnlineService.historyOrderOnlineDetail)
router.get('/online/provinces', addressService.getProvinces)
router.get('/online/districts/:id', addressService.getDistricts)
router.get('/online/wards/:id', addressService.getWards)
router.post('/online/shipping-fee', addressService.calculateShippingFee)

router.get('/view-order/:tableSlug', orderService.getOrderInfor)
router.get('/promotion', orderService.getPromotions)

router.get('/print-bill/:tableSlug', orderService.printerBill)
router.get('/category/get-all', orderService.getCategory)
router.get('/verify-slug/:tableSlug', orderService.verifyTableSlug)
router.get('/area/get-all', orderService.getAllArea)
router.get('/processing-ticket/kitchen', orderService.getProcessingTicketKitchen)
router.get('/processing-ticket/bar', orderService.getProcessingTicketBar)

// For admin & emoployee
router.get('/order/tables/:id', menuService.getTablesByAreaId)
router.get('/order/move-table', orderService.moveTable)
router.post('/order/close/:tableSlug', orderService.closeTable)
router.get('/order/create-qr', menuService.createQRCode)
router.get('/order/get-revenue', orderService.getRevenueByDay)
router.get('/order/history', orderService.historyOrder)
router.get('/order/history/print-bill', orderService.printerBillAgain)
router.patch('/order/update/processing-status', validation.validatorUpdateProcessingStatus(), orderService.updateProcessingStatus)

router.post('/apply-promotion', orderService.applyPromotion)
router.get('/order/menu/:id', menuService.getMenuDetail)

router.post('/:tableSlug', orderService.orderMenu)
router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router