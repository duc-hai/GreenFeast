const express = require('express')
const errorHandler = require('../middlewares/error.handler')
const adminRouter = require('./admin.route')
const googleRouter = require('./google.route')
const authRouter = require('./auth.route')
const userRouter = require('./user.route')
const orderRouter = require('./order.route')
const forwardService = require('../services/forward.microservices')
const jwtTokenGuard = require('../middlewares/jwt.token.guard')
const recommendService = require('../services/recommend.service')
const router = express.Router()
const accessControl = require('../middlewares/access.control')

router.use('/auth/google', googleRouter)
router.use('/payment', forwardService.forwardRequestWithAlias('payment'))
router.use('/recommend', jwtTokenGuard.jwtTokenValidatorBoth, recommendService.sendRequestToService)
router.use('/statistics', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'revenue'), forwardService.forwardRequestWithAlias('statistics'))
router.use('/tms', forwardService.forwardRequestWithAlias('tms'))
router.use('/notification', jwtTokenGuard.jwtTokenValidatorUser, forwardService.forwardRequestWithAlias('notification'))
router.use('/admin', adminRouter) //Route restaurant side (admin restaurant, employees, ...)  
router.use('/auth', authRouter) //Handle routes in customer
router.use('/user', userRouter)
router.use('/order', orderRouter)

//Handle exceptions
router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router