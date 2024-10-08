const express = require('express')
const errorHandler = require('../middlewares/error.handler')
const menuService = require('../services/menu.service')
const orderService = require('../services/order.service')
const orderOnlineService = require('../services/order.online.service')
const addressService = require('../services/address.service')
const router = express.Router()
const validation = require('../validations/body.validation')
const ratingService = require('../services/rating.service')

router.get('/menu/get-list', menuService.getAllMenu)
router.get('/menu/get-by-category/:id', menuService.getMenuByCategory)
router.get('/menu/search', menuService.searchMenu)
router.get('/view-rating/:id', ratingService.viewRating)

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
router.get('/order/online/history-list', orderOnlineService.manageOrderAdmin)
router.get('/order/online/history/:id', orderOnlineService.historyOrderOnlineDetail)
router.post('/order/online/update-status', orderOnlineService.updateStatusOrder)

router.get('/order/tables/:id', menuService.getTablesByAreaId)
router.get('/order/move-table', orderService.moveTable)
router.post('/order/close/:tableSlug', orderService.closeTable)
router.get('/order/create-qr', menuService.createQRCode)
router.get('/order/get-revenue', orderService.getRevenueByDay)
router.get('/order/history', orderService.historyOrder)
router.get('/order/history/print-bill', orderService.printerBillAgain)
router.patch('/order/update/processing-status', validation.validatorUpdateProcessingStatus(), orderService.updateProcessingStatus)
router.patch('/order/delete/order-menu', orderService.deleteMenuOrder)

router.post('/apply-promotion', orderService.applyPromotion)
router.post('/order/menu/detail', menuService.getMenuDetail)
router.post('/rating', validation.checkValidationRating(), ratingService.ratingMenu)

router.get('/history-list', orderService.historyOrderListCustomer)
router.get('/history-detail/:id', orderService.historyOrderDetailCustomer)

router.post('/order/menu-employee', orderService.orderMenuByEmployee)

router.post('/:tableSlug', orderService.orderMenu)
router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router