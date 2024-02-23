const { verify } = require('jsonwebtoken')
const User = require('../models/user')

//For restaurant side
exports.jwtTokenValidatorRestaurantSide = async (req, res, next) => {
    try {
        let accessToken

        if (req.headers.authorization)
            accessToken = req.headers.authorization.split(" ")[1]
        else if (req.cookies || req.signedCookies) {
            accessToken = req.cookies?.access_token || req.signedCookies?.access_token
            //accessToken = req.headers.cookie.split("=")[1]
        }
        else 
            return next([401, 'error', 'Không thể xác thực, vui lòng kiểm tra trạng thái đăng nhập'])
        
        if (!accessToken) {
            return next([401, 'error', 'Không thể xác thực, vui lòng kiểm tra trạng thái đăng nhập'])
        }

        const verified = await verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY || '')

        if (!verified) {
            return next([401, 'error', 'Không thể xác thực, access token không hợp lệ'])
        }

        const user = await User.findOne({
            _id: verified.username,
            user_type: 1
        })

        if (!user)
            return next([401, 'error', 'Không thể xác thực tài khoản'])
        
        req.user = user

        return next()
    }   
    catch (err) {
        return next([400, 'error', err.message])
    }
}

//If the customer is not logged in, it will be ignored. If so, req.user and next will be attached to the next handlers.
exports.jwtTokenValidatorCustomer = async (req, res, next) => {
    try {
        let accessToken

        if (req.headers.authorization)
            accessToken = req.headers.authorization.split(" ")[1]
        else if (req.cookies || req.signedCookies) {
            accessToken = req.cookies?.access_token || req.signedCookies?.access_token
            //accessToken = req.headers.cookie.split("=")[1]
        }
        else 
            return next()
    
        if (!accessToken)
            return next()

        const verified = await verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY || '')

        if (!verified) {
            return next()
        }
        
        const user = await User.findOne({
            _id: verified.username,
            user_type: 2
        })
        
        if (!user)
            return next()
        
        req.user = user

        return next()
    }   
    catch (err) {
        return next([400, 'error', err.message])
    }
}
