const express = require('express')
const router = express.Router()
const paymentService = require('../services/payment.service')
const errorHandler = require('../middlewares/error.handler')

router.post('/create-payment-url', paymentService.createPaymentUrl)
router.get('/vnpay_return', paymentService.vnpayReturn)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandler)

module.exports = router