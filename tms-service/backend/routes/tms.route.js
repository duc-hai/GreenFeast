const express = require('express')
const router = express.Router()
const tmsService = require('../services/tms.service')
const errorHandler = require('../middlewares/error.handler')

router.post('/update-status-order', tmsService.updateStatusOrder)

router.post('/api/new-order', tmsService.newOrder)

router.post('/register-tms', tmsService.registerOrder)
router.post('/get-token', tmsService.getToken)
router.get('/get-order/:id', tmsService.getOrderById)
router.get('/order-list', tmsService.getOrderList)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandler)

module.exports = router