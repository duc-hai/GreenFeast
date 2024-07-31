const express = require('express')
const router = express.Router()
const errorHandler = require('../middlewares/error.handler')
const statisticsService = require('../services/statistics.service')

router.get('/num-customer', statisticsService.getNumberOfCustomer)
router.get('/get-revenue', statisticsService.getRevenue)
router.get('/area', statisticsService.getArea)
router.get('/menu', statisticsService.getMenu)
router.get('/payment-method', statisticsService.getRevenueByPaymentMethod)
router.get('/customer', statisticsService.getStatisticsByCustomer)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandler)

module.exports = router