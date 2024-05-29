const express = require('express')
const router = express.Router()
const forwardService = require('../services/forward.microservices')
const jwtTokenGuard = require('../middlewares/jwt.token.guard')

router.get('/menu/get-list', jwtTokenGuard.jwtTokenValidatorCustomer, forwardService.forwardRequestWithAlias('order'))
router.get('/menu/get-by-category/:id', jwtTokenGuard.jwtTokenValidatorCustomer, forwardService.forwardRequestWithAlias('order'))
router.post('/:tableSlug', jwtTokenGuard.jwtTokenValidatorBoth, forwardService.forwardRequestWithAlias('order'))

router.get('/view-order/:tableSlug', forwardService.forwardRequestWithAlias('order'))
router.get('/promotion', forwardService.forwardRequestWithAlias('order'))
router.get('/print-bill/:tableSlug', forwardService.forwardRequestWithAlias('order'))
router.get('/category/get-all', forwardService.forwardRequestWithAlias('order'))
router.get('/menu/search', forwardService.forwardRequestWithAlias('order'))
router.get('/verify-slug/:tableSlug', forwardService.forwardRequestWithAlias('order'))

router.use('/', forwardService.forwardRequestWithAlias('order'))

module.exports = router