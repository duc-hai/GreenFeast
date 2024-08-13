const express = require('express')
const router = express.Router()
const tmsService = require('../services/tms.service')
const errorHandler = require('../middlewares/error.handler')

router.post('/login', tmsService.login)
router.post('/new-token', tmsService.refreshToken)
router.post('/api/new-order', tmsService.newOrder)
router.get('/get-order', tmsService.getOrderWithStatus)
router.get('/detail-order/:id', tmsService.getDetailOrder)
router.post('/update-status-order', tmsService.updateStatusOrder)
router.post('/resend-order', tmsService.resendOrder)
router.get('/query-return', tmsService.queryReturn)
router.get('/statistics/query-return', tmsService.statisticsQueryReturn) //for app.use('/')

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandler)

module.exports = router