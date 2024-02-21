const { check } = require('express-validator')

const validatorLogin = () => [
    check('username').exists().withMessage('Vui lòng nhập tên đăng nhập')
        .notEmpty().withMessage('Tên đăng nhập không được để trống')
        .isMobilePhone().withMessage('Số điện thoại không hợp lệ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 kí tự'),

    // check('account_type').exists().withMessage('Vui lòng nhập loại tài khoản')
    //     .notEmpty().withMessage('Loại tài khoản không được để trống')
    //     .isNumeric().withMessage('Loại tài khoản không hợp lệ')
    //     .isIn([1, 2]).withMessage('Loại tài khoản không hợp lệ') //Account type must be 1 (employee) or 2 (customer)
]

const validatorRegister = () => [
    check('username').exists().withMessage('Vui lòng nhập tên đăng nhập')
        .notEmpty().withMessage('Tên đăng nhập không được để trống')
        .isMobilePhone().withMessage('Số điện thoại không hợp lệ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 kí tự'),
]

module.exports = {
    validatorLogin, validatorRegister
}