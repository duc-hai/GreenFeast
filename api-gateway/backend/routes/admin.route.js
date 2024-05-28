const express = require('express')
const router = express.Router()
const userService = require('../services/user.service')
const userType = require('../middlewares/assign.user.type')
const validation = require('../validations/body.validation')
const jwtTokenGuard = require('../middlewares/jwt.token.guard')
const accessControl = require('../middlewares/access.control')
const callMicroservice = require('../services/call.microservices')
const upload = require('../middlewares/multer.menu')

/*
    Unlike customer, employee pages must be authenticated, so I separated them into a separate admin route
*/

//The login method of the customer and the admin is the same, only the user type parameter in the database is different, so there needs to be a middleware to store the user_type before passing it to the next middleware to process the login.
router.post('/auth/signin', validation.validatorLogin(), userType.assignUserType(1), userService.loginAccount)

router.post('/create-employee', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'employee'), validation.validatorRegisterEmployee(), userService.createEmployeeeAccount)

router.get('/get-employees', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'employee'), userService.getEmployeees)

router.patch('/user/update', jwtTokenGuard.jwtTokenValidatorRestaurantSide, userType.assignUserType(1), validation.validatorUpdateUserInfor(), userService.updateUser)

router.get('/get-resource-rbac', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'employee'), userService.getResourceRbac)

//________________________________________________________________________________________________________________________________________________________________________________________________

/*
    Management service
*/

// //Menu
// router.get('/menu/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'menu'), callMicroservice.forwardRequest)
// router.get('/menu/get-by-category/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'menu'), callMicroservice.forwardRequest)
// router.get('/menu/search', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'menu'), callMicroservice.forwardRequest)
// router.delete('/menu/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'menu'), callMicroservice.forwardRequest)
// router.post('/menu/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'menu'), upload.single('image'), callMicroservice.forwardRequestUploadFile)
// router.put('/menu/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'menu'), upload.single('image'), callMicroservice.forwardRequestUploadFile)

// //Table
// router.post('/table/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'table'), callMicroservice.forwardRequest)
// router.post('/table/create-auto', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'table'), callMicroservice.forwardRequest)
// router.get('/table/get-tables', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'table'), callMicroservice.forwardRequest)
// // router.put('/table/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'table'), callMicroservice.forwardRequest)
// router.delete('/table/delete', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'table'), callMicroservice.forwardRequest)

// //Area
// // router.get('/area/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'area'), callMicroservice.forwardRequest)
// router.get('/area/get-all', callMicroservice.forwardRequest)
// router.post('/area/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'area'), callMicroservice.forwardRequest)
// router.put('/area/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'area'), callMicroservice.forwardRequest)
// router.delete('/area/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'area'), callMicroservice.forwardRequest)

// //Category
// router.get('/category/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'category'), callMicroservice.forwardRequest)
// router.post('/category/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'category'), callMicroservice.forwardRequest)
// router.put('/category/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'category'), callMicroservice.forwardRequest)
// router.delete('/category/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'category'), callMicroservice.forwardRequest)

// //Promotion
// router.get('/promotion/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'promotion'), callMicroservice.forwardRequest)
// router.get('/promotion/get-form-promotion', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'promotion'), callMicroservice.forwardRequest)
// router.post('/promotion/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'promotion'), callMicroservice.forwardRequest)
// router.put('/promotion/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'promotion'), callMicroservice.forwardRequest)
// router.delete('/promotion/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'promotion'), callMicroservice.forwardRequest)

// //Printer
// router.get('/printer/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'printer'), callMicroservice.forwardRequest)
// router.get('/printer/get-printer-type', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'printer'), callMicroservice.forwardRequest)
// router.post('/printer/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'printer'), callMicroservice.forwardRequest)
// router.put('/printer/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'printer'), callMicroservice.forwardRequest)
// router.delete('/printer/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'printer'), callMicroservice.forwardRequest)

// /*
//     Order service
// */
// // router.get('/order/tables/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide,  accessControl.grantAccess('readAny', 'order'), callMicroservice.forwardRequestOrderService)
// router.get('/order/tables/:id', callMicroservice.forwardRequestOrderService)
// router.get('/order/move-table', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'order'), callMicroservice.forwardRequestOrderService)
// router.post('/order/close/:tableSlug', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'order'), callMicroservice.forwardRequestOrderService)

// router.get('/order/get-revenue', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'revenue'), callMicroservice.forwardRequestOrderService)
// router.get('/create-qr', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'order'), callMicroservice.forwardRequestOrderService)
// router.get('/order/history', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'revenue'), callMicroservice.forwardRequestOrderService)
// router.get('/order/history/print-bill', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'revenue'), callMicroservice.forwardRequestOrderService)

module.exports = router