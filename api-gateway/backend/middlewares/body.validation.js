const { check } = require('express-validator')

const validatorLogin = () => [
    check('username')
        .exists().withMessage('Vui lòng nhập tên đăng nhập')
        .notEmpty().withMessage('Tên đăng nhập không được để trống')
        .isMobilePhone().withMessage('Số điện thoại không hợp lệ'),

    check('password')
        .exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 kí tự'),

    // check('account_type').exists().withMessage('Vui lòng nhập loại tài khoản')
    //     .notEmpty().withMessage('Loại tài khoản không được để trống')
    //     .isNumeric().withMessage('Loại tài khoản không hợp lệ')
    //     .isIn([1, 2]).withMessage('Loại tài khoản không hợp lệ') //Account type must be 1 (employee) or 2 (customer)
]

const validatorRegister = () => [
    check('username')
        .exists().withMessage('Vui lòng nhập tên đăng nhập')
        .notEmpty().withMessage('Tên đăng nhập không được để trống')
        .isMobilePhone().withMessage('Số điện thoại không hợp lệ'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 kí tự'),
]

const validatorRegisterEmployee = () => [
    check('username')
        .exists().withMessage('Vui lòng nhập tên đăng nhập')
        .notEmpty().withMessage('Tên đăng nhập không được để trống')
        .isMobilePhone().withMessage('Số điện thoại không hợp lệ'),

    check('password')
        .exists().withMessage('Vui lòng nhập mật khẩu')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 kí tự'),

    check('full_name')
        .exists().withMessage('Vui lòng nhập họ tên')
        .notEmpty().withMessage('Họ tên không được để trống'),
    
    check('role')
        .exists().withMessage('Vui lòng chọn vai trò')
        .notEmpty().withMessage('Vai trò không được để trống')   
        .isIn('cashier,waitstaff,other').withMessage('Vai trò không hợp lệ'),

    check('position')
        .optional(),

    check('experience')
        .optional(),

    check('grants')
        .optional()
]

const validatorUpdateUserInfor = () => [
    check('full_name')
        .optional()
        .isLength({ min: 3 }).withMessage('Tên người dùng quá ngắn'),
    
    check('birthday')
        .optional()
        .isISO8601().toDate().withMessage('Ngày sinh không hợp lệ'),
        
    check('gender')
        .optional()
        .isIn('nam,nữ,khác').withMessage('Giới tính không hợp lệ'),

    check('phone_number')
        .optional()
        .isMobilePhone().withMessage('Số điện thoại không hợp lệ'),

    check('address')
        .optional(),
    
    check('email')
        .optional()
        .isEmail().withMessage('Email không hợp lệ') 
]

module.exports = {
    validatorLogin, validatorRegister, validatorRegisterEmployee, validatorUpdateUserInfor
}