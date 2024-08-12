const express = require('express')
const router = express.Router()
const tmsService = require('../services/tms.service')
const errorHandler = require('../middlewares/error.handler')

router.post('/login', tmsService.login)
router.post('/new-token', tmsService.refreshToken)
router.post('/api/new-order', tmsService.newOrder)
router.post('/update-status-order', tmsService.updateStatusOrder)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandler)

module.exports = router