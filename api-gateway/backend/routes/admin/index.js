const express = require('express')
const router = express.Router()
const accountService = require('../../services/account.service')
const accountType = require('../../middlewares/account.type')
const validation = require('../../middlewares/body.validation')
const jwtTokenGuard = require('../../middlewares/jwt.token.guard')
const accessControl = require('../../middlewares/access.control')
const callMicroservice = require('../../services/call.microservices')
const upload = require('../../middlewares/multer.menu')

//The login method of the customer and the admin is the same, only the account type parameter in the database is different, so there needs to be a middleware to store the account_type before passing it to the next middleware to process the login.
router.post('/auth/signin', validation.validatorLogin(), accountType.assignAccountType(1), accountService.loginAccount)

//Remember login with restaurant's role
router.post('/create-employee', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'employee'), validation.validatorRegisterEmployee(), accountService.createEmployeeeAccount)

router.get('/get-employees', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'employee'), accountService.getEmployeees)

router.patch('/user/update', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accountType.assignAccountType(1), validation.validatorUpdateUserInfor(), accountService.updateUser)

router.get('/get-resource-rbac', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'employee'), accountService.getResourceRbac)

/*
    Management service
*/

//Menu
router.get('/menu/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'menu'), callMicroservice.forwardRequest)
router.get('/menu/get-by-category/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'menu'), callMicroservice.forwardRequest)
router.get('/menu/search', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'menu'), callMicroservice.forwardRequest)
router.delete('/menu/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'menu'), callMicroservice.forwardRequest)
router.post('/menu/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'menu'), upload.single('image'), callMicroservice.forwardRequestUploadFile)
router.put('/menu/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'menu'), upload.single('image'), callMicroservice.forwardRequestUploadFile)

//Table
router.post('/table/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'table'), callMicroservice.forwardRequest)
router.post('/table/create-auto', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'table'), callMicroservice.forwardRequest)
router.get('/table/get-tables', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'table'), callMicroservice.forwardRequest)
// router.put('/table/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'table'), callMicroservice.forwardRequest)
router.delete('/table/delete', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'table'), callMicroservice.forwardRequest)

//Area
router.get('/area/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'area'), callMicroservice.forwardRequest)
router.post('/area/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'area'), callMicroservice.forwardRequest)
router.put('/area/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'area'), callMicroservice.forwardRequest)
router.delete('/area/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'area'), callMicroservice.forwardRequest)

//Category
router.get('/category/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'category'), callMicroservice.forwardRequest)
router.post('/category/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'category'), callMicroservice.forwardRequest)
router.put('/category/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'category'), callMicroservice.forwardRequest)
router.delete('/category/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'category'), callMicroservice.forwardRequest)

//Promotion
router.get('/promotion/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'promotion'), callMicroservice.forwardRequest)
router.get('/promotion/get-form-promotion', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'promotion'), callMicroservice.forwardRequest)
router.post('/promotion/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'promotion'), callMicroservice.forwardRequest)
router.put('/promotion/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'promotion'), callMicroservice.forwardRequest)
router.delete('/promotion/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'promotion'), callMicroservice.forwardRequest)

//Printer
router.get('/printer/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'printer'), callMicroservice.forwardRequest)
router.get('/printer/get-printer-type', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'printer'), callMicroservice.forwardRequest)
router.post('/printer/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'printer'), callMicroservice.forwardRequest)
router.put('/printer/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'printer'), callMicroservice.forwardRequest)
router.delete('/printer/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'printer'), callMicroservice.forwardRequest)

/*
    Order service
*/
router.get('/order/tables/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide,  accessControl.grantAccess('readAny', 'order'), callMicroservice.forwardRequestOrderService)
router.get('/order/move-table', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'order'), callMicroservice.forwardRequestOrderService)
router.post('/order/close/:tableSlug', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'order'), callMicroservice.forwardRequestOrderService)

router.get('/order/get-revenue', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'revenue'), callMicroservice.forwardRequestOrderService)

module.exports = router