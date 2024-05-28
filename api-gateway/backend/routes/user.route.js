const express = require('express')
const userType = require('../middlewares/assign.user.type')
const validation = require('../validations/body.validation')
const jwtTokenGuard = require('../middlewares/jwt.token.guard')
const router = express.Router()
const userService = require('../services/user.service')

//for customer
router.patch('/update', jwtTokenGuard.jwtTokenValidatorCustomer, validation.validatorUpdateUserInfor(), userType.assignUserType(2), userService.updateUser)

module.exports = router