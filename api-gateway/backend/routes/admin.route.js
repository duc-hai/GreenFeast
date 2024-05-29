const express = require('express')
const router = express.Router()
const userService = require('../services/user.service')
const userType = require('../middlewares/assign.user.type')
const validation = require('../validations/body.validation')
const jwtTokenGuard = require('../middlewares/jwt.token.guard')
const accessControl = require('../middlewares/access.control')
const forwardService = require('../services/forward.microservices')
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

//___________________________________________________________________________________________________

/*
    Management service. Because each url has owner authorization, then we need to list all path to check access control before forwarding request
*/

//Menu
router.get('/menu/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'menu'), forwardService.forwardRequestWithAlias('management'))
router.get('/menu/get-by-category/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'menu'), forwardService.forwardRequestWithAlias('management'))
router.get('/menu/search', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'menu'), forwardService.forwardRequestWithAlias('management'))
router.delete('/menu/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'menu'), forwardService.forwardRequestWithAlias('management'))
router.post('/menu/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'menu'), upload.single('image'), forwardService.forwardRequestAliasUploadFile('management'))
router.put('/menu/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'menu'), upload.single('image'), forwardService.forwardRequestAliasUploadFile('management'))

// //Table
router.post('/table/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'table'), forwardService.forwardRequestWithAlias('management'))
router.post('/table/create-auto', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'table'), forwardService.forwardRequestWithAlias('management'))
router.get('/table/get-tables', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'table'), forwardService.forwardRequestWithAlias('management'))
// router.put('/table/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'table'), forwardService.forwardRequestWithAlias('management'))
router.delete('/table/delete', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'table'), forwardService.forwardRequestWithAlias('management'))

//Area
// router.get('/area/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'area'), forwardService.forwardRequestWithAlias('management'))
router.get('/area/get-all', forwardService.forwardRequestWithAlias('management'))
router.post('/area/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'area'), forwardService.forwardRequestWithAlias('management'))
router.put('/area/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'area'), forwardService.forwardRequestWithAlias('management'))
router.delete('/area/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'area'), forwardService.forwardRequestWithAlias('management'))

//Category
router.get('/category/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'category'), forwardService.forwardRequestWithAlias('management'))
router.post('/category/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'category'), forwardService.forwardRequestWithAlias('management'))
router.put('/category/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'category'), forwardService.forwardRequestWithAlias('management'))
router.delete('/category/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'category'), forwardService.forwardRequestWithAlias('management'))

//Promotion
router.get('/promotion/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'promotion'), forwardService.forwardRequestWithAlias('management'))
router.get('/promotion/get-form-promotion', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'promotion'), forwardService.forwardRequestWithAlias('management'))
router.post('/promotion/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'promotion'), forwardService.forwardRequestWithAlias('management'))
router.put('/promotion/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'promotion'), forwardService.forwardRequestWithAlias('management'))
router.delete('/promotion/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'promotion'), forwardService.forwardRequestWithAlias('management'))

//Printer
router.get('/printer/get-all', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'printer'), forwardService.forwardRequestWithAlias('management'))
router.get('/printer/get-printer-type', jwtTokenGuard.jwtTokenValidatorRestaurantSide, forwardService.forwardRequestWithAlias('management'))
router.post('/printer/create', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'printer'), forwardService.forwardRequestWithAlias('management'))
router.put('/printer/update/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'printer'), forwardService.forwardRequestWithAlias('management'))
router.delete('/printer/delete/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'printer'), forwardService.forwardRequestWithAlias('management'))

/*
    Order service
*/
// router.get('/order/tables/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide,  accessControl.grantAccess('readAny', 'order'), forwardService.forwardRequestOrderService)
router.get('/order/move-table', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('updateAny', 'order'), forwardService.forwardRequestWithAlias('order'))
router.post('/order/close/:tableSlug', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('deleteAny', 'order'), forwardService.forwardRequestWithAlias('order'))
router.get('/order/get-revenue', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('readAny', 'revenue'), forwardService.forwardRequestWithAlias('order'))
router.get('/create-qr', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'order'), forwardService.forwardRequestWithAlias('order'))
router.get('/order/history', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'revenue'), forwardService.forwardRequestWithAlias('order'))
router.get('/order/history/print-bill', jwtTokenGuard.jwtTokenValidatorRestaurantSide, accessControl.grantAccess('createAny', 'revenue'), forwardService.forwardRequestWithAlias('order'))

//Lấy danh sách bàn theo mã khu vực, phân quyền chỉ cho nhân viên xem
router.get('/order/tables/:id', jwtTokenGuard.jwtTokenValidatorRestaurantSide, forwardService.forwardRequestWithAlias('order'))

module.exports = router