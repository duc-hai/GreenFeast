const createError = require('http-errors')
const { verify } = require('jsonwebtoken')
const StatusCode = require('../enums/http.status.code')
const User = require('../models/user')
const TmsInfor = require('../enums/tms.infor')

const getAccessToken = (req) => {
    try {
        //The access token will be stored in a cookie or sent to the server with the Bearer header, so you need to check both
        if (req.headers.authorization)
            return req.headers.authorization.split(" ")[1]
        else if (req.cookies || req.signedCookies)
            return req.cookies?.access_token || req.signedCookies?.access_token
            //return req.headers.cookie.split("=")[1]
        else 
            return null
    }   
    catch (err) {
        return next(createError(StatusCode.InternalServerError_500, err.message)) 
    }   
}

//For restaurant side
exports.jwtTokenValidatorRestaurantSide = async (req, res, next) => {
    try {
        const accessToken = getAccessToken(req)
        if (!accessToken) 
            return next(createError(StatusCode.Unauthorized_401, 'Không thể xác thực, vui lòng kiểm tra trạng thái đăng nhập'))

        //verify with secret key
        const verified = await verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY || '')
        if (!verified) 
            return next(createError(StatusCode.Unauthorized_401, 'Không thể xác thực, access token không hợp lệ'))

        const user = await User.findOne({
            _id: verified.username,
            user_type: 1,
            status: true
        })
        if (!user)
            return next(createError(StatusCode.Unauthorized_401, 'Không thể xác thực tài khoản'))
        
        //Success
        req.user = user

        return next()
    }   
    catch (err) {
        return next(createError(StatusCode.InternalServerError_500, err.message)) 
    }
}

//If the customer is not logged in, it will be ignored. If so, req.user and next will be attached to the next handlers.
exports.jwtTokenValidatorCustomer = async (req, res, next) => {
    try {
        const accessToken = getAccessToken(req)
        if (!accessToken)
            return next()

        const verified = await verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY || '')
        if (!verified)
            return next()
        
        const user = await User.findOne({ _id: verified.username, user_type: 2, status: true })
        if (!user)
            return next()
        
        //Had user data
        req.user = user
        return next()
    }   
    catch (err) {
        return next(createError(StatusCode.InternalServerError_500, err.message)) 
    }
}

exports.jwtTokenValidatorBoth = async (req, res, next) => {
    try {
        const accessToken = getAccessToken(req)
        if (!accessToken)
            return next()

        const verified = await verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY || '')
        if (!verified) {
            return next()
        }
        
        const user = await User.findOne({
            _id: verified.username,
            status: true
        })
        if (!user)
            return next()
        
        req.user = user

        return next()
    }   
    catch (err) {
        return next(createError(StatusCode.InternalServerError_500, err.message)) 
    }
}

exports.jwtTokenValidatorUser = async (req, res, next) => {
    try {
        const accessToken = getAccessToken(req)
    
        if (!accessToken)
            return next(createError(StatusCode.Unauthorized_401, 'Thiếu mã JWT'))
        const verified = await verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY || '')

        if (!verified) 
            return next(createError(StatusCode.Unauthorized_401, 'Không thể xác thực tài khoản'))
        const user = await User.findOne({
            _id: verified.username,
            status: true
        })
        
        if (!user)
            return next(createError(StatusCode.Unauthorized_401, 'Không thể xác thực tài khoản'))
        req.user = user

        return next()
    }   
    catch (err) {
        return next(createError(StatusCode.InternalServerError_500, err.message)) 
    }
}

exports.checkTokenTms = (req, res, next) => {
    try {
        const token = getAccessToken(req)
        if (!token) 
            return next(createError(StatusCode.Unauthorized_401, 'Không thể xác thực, vui lòng kiểm tra token'))

        if (token != TmsInfor.token) 
            return next(createError(StatusCode.Unauthorized_401, 'Token không hợp lệ'))

        return next()
    }
    catch (err) {
        return next(createError(StatusCode.InternalServerError_500, err.message)) 
    }
}