const express = require('express')
const validation = require('../middlewares/body.validation')
const errorHandler = require('../middlewares/error.handler')
const accountService = require('../services/account.service')
const rbacService = require('../services/rbac.service')
const adminRouter = require('./admin')
const googleRouter = require('./google')
const accessControl = require('../middlewares/access.control')
const jwtTokenGuard = require('../middlewares/jwt.token.guard')
const accountType = require('../middlewares/account.type')

const router = express.Router()

router.use('/auth/google', googleRouter)
router.use('/console', adminRouter) //Route restaurant side (admin restaurant, employees, ...)  

/*
    Handle routes in customer
*/
router.post('/auth/signin', validation.validatorLogin(), accountType.assignAccountType(2), accountService.loginAccount)
router.post('/auth/signup', validation.validatorRegister(), accountService.signupAccount)
router.get('/auth/logout', accountService.logOut)

router.post('/auth/refresh-token', accountService.refreshToken)
router.get('/test-access-control', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('readAny', 'menu'))
//router.get('/test-jwt', jwtTokenGuard.jwtTokenValidatorCustomer, accountService.testJWT)

/*
    Handle exceptions
*/
router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router