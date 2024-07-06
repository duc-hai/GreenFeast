const { check } = require('express-validator')

//Check validation of request body
const validatorUpdateProcessingStatus = () => [
    check('orderId')
        .exists().withMessage('Vui lòng nhập tên mã hóa đơn')
        .notEmpty().withMessage('Tên mã hóa đơn không được để trống')
        .isMongoId().withMessage('Mã hóa đơn không hợp lệ'),

    check('orderDetailId')
        .exists().withMessage('Vui lòng nhập mã đặt món')
        .notEmpty().withMessage('Mã đặt món không được để trống')
        .isMongoId().withMessage('Mã đặt món không hợp lệ'),

    check('menuId')
        .exists().withMessage('Vui lòng nhập mã món')
        .notEmpty().withMessage('Mã món không được để trống')
        .isNumeric().withMessage('Mã món không hợp lệ (số)'),

    check('status')
        .exists().withMessage('Vui lòng nhập trạng thái lên món')
        .notEmpty().withMessage('Trạng thái lên món không được để trống')
        .isNumeric().withMessage('Trạng thái lên món không hợp lệ'),    
]

module.exports = {
    validatorUpdateProcessingStatus
}