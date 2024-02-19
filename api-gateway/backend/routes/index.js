const express = require('express')
const router = express.Router()
const validation = require('../middlewares/validation')
const errorHandler = require('../middlewares/errorHandler')
const accountSerice = require('../services/AccountService')
const menuService = require('../services/MenuService')

router.post('/auth/signin', validation.validatorLogin(), accountSerice.loginAccount)
router.post('/auth/signup', validation.validatorRegister(), accountSerice.signupAccount)
router.get('/menu/add', menuService.sendQueue)

router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router