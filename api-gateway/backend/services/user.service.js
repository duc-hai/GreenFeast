'use strict'

const User = require('../models/user')
const bcrypt = require('bcrypt')
const { verify } = require('jsonwebtoken')
const jwt = require('jsonwebtoken')
const Role = require('../models/role')
const { v4: uuidv4 } = require('uuid')
const { join } = require('path')
const fs = require('fs')
const checkValidation = require('../helpers/check.validation')
const StatusCode = require('../enums/http.status.code')
const createError = require('http-errors')
const hiddenPropertiesOption = require('../config/hidden.properties')

class AccountService {
    //For both client and admin
    async loginAccount (req, res, next) {
        try {
            let { username, password, ...rest } = req.body || null
            
            //Check validation inputs
            if (checkValidation(req) !== null)      
                return next(createError(StatusCode.BadRequest_400, checkValidation(req)))   

            let user = await User.findOne({ _id: username, user_type: req.locals.userType || 2, status: true }).select(hiddenPropertiesOption.userInfor).lean() //lean will return JS Object instead of Mongoose document

            if (!user)
                return next(createError(StatusCode.BadRequest_400, 'Số điện thoại hoặc mật khẩu không đúng')) //Should not return the detail message for client

            //Password is not correct
            const matched = await bcrypt.compareSync(password + user.salt, user.password)

            if (!matched)
                return next(createError(StatusCode.BadRequest_400, 'Số điện thoại hoặc mật khẩu không đúng'))

            //Account is correct: create access token and refresh token
            const accessToken = await jwt.sign({ username: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '10h' })
            const refreshToken = await jwt.sign({ username: user._id }, process.env.REFRESH_TOKEN_SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '720h' })
            
            res.cookie('access_token', accessToken, {
                httpOnly: true, //Config cookie just accessed by server
                signed: true, //Cookie secure, prevents client-side modifications
                maxAge: 10 * 60 * 60 * 1000, //Expires after 10 hours
                // sameSite: 'none',
                // secure: true // Cookies are only transmitted over a secure channel (eg: https protocol)
            })

            delete user.password //Remove data unneccessary before send to client
            delete user.salt //Delete just working with JS Object (not Mongoose Document type)
            
            return res.status(200).json({
                status: 'success',
                message: 'Đăng nhập thành công',
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    full_name: user?.full_name,
                    data: user
                }
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    //For customer
    async signupAccount (req, res, next) {
        try {
            const { username, password, full_name, ...rest } = req.body || null 

            //Check validation inputs
            if (checkValidation(req) !== null)      
                return next(createError(StatusCode.BadRequest_400, checkValidation(req)))      

            const checkDuplicateUsername = await User.findOne({ _id: username, user_type : 2, status: true })
          
            if (checkDuplicateUsername)
                return next(createError(StatusCode.Forbidden_403, 'Số điện thoại đã tồn tại'))    

            //Create new user
            let newUser = new User({
                _id: username, full_name, user_type: 2, role: 'customer', password: password
            })    

            newUser = await newUser.save() // password will be hashed before save in DB (middleware of mongoose)

            if (!newUser)
                return next(createError(StatusCode.Forbidden_403, 'Đã xảy ra lỗi khi tạo người dùng'))  

            return res.status(200).json({
                status: 'success',
                message: `Tài khoản ${username} được tạo thành công`
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    async refreshToken (req, res, next) {
        try {
            if (!req.body.refresh_token)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu refresh token'))

            const decodeRefreshToken = await verify(req.body.refresh_token, process.env.REFRESH_TOKEN_SECRET_KEY || '', {
                //ignoreExpiration: true, //If the refresh token expires, it will still allow verification
            })

            if (!decodeRefreshToken)    
                return next(createError(StatusCode.BadRequest_400, 'Refresh token không hợp lệ hoặc đã hết hạn'))

            const username = decodeRefreshToken.username

            if (!username)    
                return next(createError(StatusCode.BadRequest_400, 'Xảy ra lỗi khi decode refresh token'))

            const accessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '10h' })
    
            res.cookie('access_token', accessToken, {
                httpOnly: true, //Config cookie just accessed by server
                signed: true, //Cookie secure, prevents client-side modifications
                maxAge: 10 * 60 * 60 * 1000, //Expires after 10 hours
                // sameSite: 'none',
                // secure: true // Cookies are only transmitted over a secure channel (eg: https protocol)
            })    
                
            return res.status(200).json({
                status: 'success',
                message: 'Lấy access token thành công',
                data: {
                    access_token: accessToken,
                }
            })    
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    async logOut (req, res, next) {
        try {
            //Simply delete the access token stored on the client-side cookie and redirect to the desired page. JWT does not provide a method to delete access tokens on the server (unless using a blacklist, which is not really necessary).
            res.clearCookie('access_token')

            //Xóa refresh token trong cache hoặc db
            
            return res.redirect(302, '/')
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    // async createEmployeeeAccount (req, res, next) {
    //     try {
    //         const { username, password, full_name, role, position, experience, grants, ... rest } = req.body || null

    //         //Check validation inputs
    //         let resultValidation = validationResult(req)
    //         if (resultValidation.errors.length != 0) {
    //             resultValidation = resultValidation.mapped()
    //             let message 
    //             for (let i in resultValidation) {
    //                 message = resultValidation[i].msg
    //                 break //Just get first message error
    //             }
    //             return next([400, 'error', message])
    //         }

    //         //Check whether username is exist or not
    //         const checkDuplicateUsername = await Account.findOne({ _id: username, account_type : 1 })
          
    //         if (checkDuplicateUsername)
    //             return next([403, 'error', 'Số điện thoại đã tồn tại'])

    //         //If role is other, we need to create new role with other power
    //         if (role === 'other') {
            
    //             if (!grants)
    //                 return next([400, 'error', 'Vui lòng nhập các quyền của nhân viên'])

    //             const uniqueString = uuidv4()

    //             await new Role({
    //                 name: uniqueString,
    //                 grants: grants
    //             }).save()
    //         }

    //         //encrypt the new account's password
    //         const hashPassword = await bcrypt.hashSync(password, 10) //10 is saltRound, this an important argument. Because an attacker can use brute force to hack an account even though the password hashed, it is necessary to randomly generate a string of characters which call "salt" to add to the password and save it in the database.
    
    //         //Create new user
    //         let newUser = new User({
    //             full_name,
    //             user_type: 1,
    //             role,
    //             employee: {
    //                 position,
    //                 experience
    //             }
    //         })    
    //         newUser = await newUser.save()

    //         if (!newUser)
    //             return next([403, 'error', 'Đã xảy ra lỗi khi tạo người dùng'])

    //         let newAccount = new Account({
    //             _id: username,
    //             password: hashPassword,
    //             user_id: newUser._id,
    //             account_type: 1
    //         })
    //         newAccount = await newAccount.save()

    //         return res.status(200).json({
    //             status: 'success',
    //             message: `Tài khoản ${username} được tạo thành công`
    //         })
    //     }
    //     catch (err) {
    //         return next(createError(StatusCode.InternalServerError_500, err.message)) 
    //     }
    // }

    // async getResourceRbac(req, res, next) {
    //     try {
    //         //Get data from local file
    //         const resourceRbacData = JSON.parse(fs.readFileSync(join(process.cwd(), './reference-data/resource.rbac.json')).toString())

    //         //console.log(resourceRbacData)
    //         //console.log(resourceRbacData[0].actions)
    //         return res.status(200).json({
    //             status: 'success',
    //             message: 'Lấy danh sách các quyền thành công',
    //             data: resourceRbacData
    //         })
    //     }
    //     catch (err) {
    //         return next(createError(StatusCode.InternalServerError_500, err.message)) 
    //     }
    // }

    //Employee or customer
    async updateUser (req, res, next) {
        try {
            if (!req.user || !req.user?._id)
                return next(createError(StatusCode.Unauthorized_401, 'Đã xảy ra lỗi, vui lòng kiểm tra trạng thái đăng nhập'))
        
            //Check validation inputs from body
            if (checkValidation(req) !== null)      
                return next(createError(StatusCode.BadRequest_400, checkValidation(req)))    

            const resultUpdate = await User.findOneAndUpdate({ _id: req.user._id, user_type: req.locals.userType, status: true }, req.body)

            if (!resultUpdate)
                return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi khi cập nhật thông tin'))
        
            return res.status(200).json({
                status: 'success',
                message: 'Cập nhật thông tin tài khoản thành công'
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    // async getEmployeees (req, res, next) {
    //     try {
    //         const users = await User.find({ user_type: 1 }).select({ __v: 0, customer: 0 })

    //         return res.status(200).json({
    //             status: 'success',
    //             message: 'Lấy danh sách nhân viên thành công',
    //             data: users
    //         })
    //     }
    //     catch (err) {
    //         return next(createError(StatusCode.InternalServerError_500, err.message)) 
    //     }
    // }
}

module.exports = new AccountService()
