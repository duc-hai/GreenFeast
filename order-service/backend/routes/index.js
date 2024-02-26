const express = require('express')

const errorHandler = require('../middlewares/error.handler')


const router = express.Router()

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router