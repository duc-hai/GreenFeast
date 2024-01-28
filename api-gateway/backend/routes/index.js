const express = require('express')
const router = express.Router()
const accountSerice = require('../services/AccountService')
const validation = require('../middlewares/validation')
const errorHandler = require('../middlewares/errorHandler')

router.post('/auth/signin', validation.validatorLogin(), accountSerice.loginAccount)
router.post('/auth/signup', validation.validatorRegister(), accountSerice.signupAccount)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router