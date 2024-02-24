const express = require('express')
const router = express.Router()
const accountService = require('../../services/account.service')
const accountType = require('../../middlewares/account.type')
const validation = require('../../middlewares/body.validation')
const jwtTokenGuard = require('../../middlewares/jwt.token.guard')
const accessControl = require('../../middlewares/access.control')
const callMicroservice = require('../../services/call.microservices')

//The login method of the customer and the admin is the same, only the account type parameter in the database is different, so there needs to be a middleware to store the account_type before passing it to the next middleware to process the login.
router.post('/auth/signin', validation.validatorLogin(), accountType.assignAccountType(1), accountService.loginAccount)

//Remember login with restaurant's role
router.post('/create-employee', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('createAny', 'employee'), validation.validatorRegisterEmployee(),  accountService.createEmployeeeAccount)

router.patch('/user/update', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accountType.assignAccountType(1), validation.validatorUpdateUserInfor(), accountService.updateUser)

router.get('/get-resource-rbac', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('readAny', 'employee'), accountService.getResourceRbac)

/*
    Management service
*/

//Menu
router.get('/menu/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('readAny', 'menu'), callMicroservice.forwardRequest)
router.get('/menu/get-by-category/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('readAny', 'menu'), callMicroservice.forwardRequest)
router.get('/menu/search', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('readAny', 'menu'), callMicroservice.forwardRequest)
router.delete('/menu/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('deleteAny', 'menu'), callMicroservice.forwardRequest)
// Handling
router.post('/menu/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('createAny', 'menu'), callMicroservice.forwardRequest)
router.post('/menu/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAcess('updateAny', 'menu'), callMicroservice.forwardRequest)

module.exports = router