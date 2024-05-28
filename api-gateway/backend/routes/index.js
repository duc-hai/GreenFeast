const express = require('express')
const errorHandler = require('../middlewares/error.handler')
const adminRouter = require('./admin.route')
const googleRouter = require('./google.route')
const callMicroservice = require('../services/call.microservices')
const authRouter = require('./auth.route')
const userRouter = require('./user.route')

const router = express.Router()

// router.use('/auth/google', googleRouter)
// router.use('/payment', callMicroservice.forwardRequestPaymentService)
// router.use('/admin', adminRouter) //Route restaurant side (admin restaurant, employees, ...)  
router.use('/auth', authRouter) //Handle routes in customer
router.use('/user', userRouter)

//Handle exceptions
router.use('/', errorHandler.catchNotFoundError)
router.use('/', errorHandler.errorHandle)

module.exports = router