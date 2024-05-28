const express = require('express')
const router = express.Router()
const callMicroservice = require('../services/call.microservices')
const jwtTokenGuard = require('../middlewares/jwt.token.guard')

// router.get('/menu/get-list', jwtTokenGuard.jwtTokenValidatorCustomer, callMicroservice.forwardRequestOrderService)
// router.get('/menu/get-by-category/:id', jwtTokenGuard.jwtTokenValidatorCustomer, callMicroservice.forwardRequestOrderService)
// router.post('/:tableSlug', jwtTokenGuard.jwtTokenValidatorBoth, callMicroservice.forwardRequestOrderService)
// router.get('/view-order/:tableSlug', callMicroservice.forwardRequestOrderService)
// router.get('/promotion', callMicroservice.forwardRequestOrderService)
// router.get('/print-bill/:tableSlug', callMicroservice.forwardRequestOrderService)
// router.get('/category/get-all', callMicroservice.forwardRequestOrderService)
// router.get('/menu/search', callMicroservice.forwardRequestOrderService)
// router.get('/verify-slug/:tableSlug', callMicroservice.forwardRequestOrderService)
// router.use('/', callMicroservice.forwardRequestOrderService)

module.exports = router