const express = require('express')
const validation = require('../middlewares/validation')
const errorHandler = require('../middlewares/error.handler')
const accountService = require('../services/account.service')
const rbacService = require('../services/rbac.service')
const adminRouter = require('./admin')
const googleRouter = require('./google')
const accessControl = require('../middlewares/access.control')
const jwtTokenGuard = require('../middlewares/jwt.token.guard')

const router = express.Router()

router.use('/auth/google', googleRouter)
router.use('/console', adminRouter) //Route restaurant side (admin restaurant, employees, ...)  

/*
    Handle routes in customer
*/
router.post('/auth/signin', validation.validatorLogin(), accountService.loginAccount)
router.post('/auth/signup', validation.validatorRegister(), accountService.signupAccount)
router.get('/auth/logout', accountService.logOut)

router.post('/auth/refresh-token', accountService.refreshToken)
//router.get('/test-jwt', jwtTokenGuard.jwtTokenValidatorCustomer, accountService.testJWT)
//NHớ cho đăng nhập với quyền của restaurant, nếu không sẽ lỗi: 
//router.get('/test-access-control', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('readAny', 'menu'))

/*
    Handle exceptions
*/
router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router