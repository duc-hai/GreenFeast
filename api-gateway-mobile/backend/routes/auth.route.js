const express = require('express')
const userService = require('../services/user.service')
const accountType = require('../middlewares/assign.user.type')
const validation = require('../validations/body.validation')
const jwtTokenGuard = require('../middlewares/jwt.token.guard')
const router = express.Router()

router.post('/tms/login', userService.loginTmsAccount)
router.post('/tms/new-token', userService.getTokenFromRefresh)
//user_type: 1 is admin, 2 for customer
router.post('/signin', validation.validatorLogin(), accountType.assignUserType(2), userService.loginAccount)
//for customer
router.post('/signup', validation.validatorRegister(), userService.signupAccount)

router.get('/logout', jwtTokenGuard.jwtTokenValidatorBoth, userService.logOut)

router.post('/refresh-token', userService.refreshToken)

module.exports = router
