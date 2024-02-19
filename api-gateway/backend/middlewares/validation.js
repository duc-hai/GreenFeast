const { check } = require('express-validator')

const validatorLogin = () => [
    check('username').exists().withMessage('Please enter your username')
        .notEmpty().withMessage('Username is required')
        .isMobilePhone().withMessage('Please enter a phone number'),

    check('password').exists().withMessage('Please enter your password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    check('account_type').exists().withMessage('Please enter your account type')
        .notEmpty().withMessage('Account type is required')
        .isNumeric().withMessage('Account type must be number')
        .isIn([0, 1]).withMessage('Account type must be 0 (employee) or 1 (customer')
]

const validatorRegister = () => [
    check('username').exists().withMessage('Please enter your username')
        .notEmpty().withMessage('Username is required')
        .isMobilePhone().withMessage('Please enter a phone number'),

    check('password').exists().withMessage('Please enter your password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

module.exports = {
    validatorLogin, validatorRegister
}