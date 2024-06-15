const express = require('express')
const router = express.Router()
const errorHandler = require('../middlewares/error.handler')
const notificationService = require('../services/notification.service')

router.get('/num-notification', notificationService.getNumberOfNoti)
router.get('/get-notifications', notificationService.getNotifications)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandler)

module.exports = router