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
const generateOtp = require('../helpers/generate.otp')
const producer = require('./producer.rabbitmq')
const clientRedis = require('../config/connect.redis')
const passport = require('passport')
const checkLogin = require('../helpers/check.login')

class UserService {
    //For both client and admin (1 for admin, 2 for customer)
    loginAccount = async (req, res, next) => {
        try {
            let { username, password, ...rest } = req.body || null
            
            //Check validation inputs
            if (checkValidation(req) !== null)      
                return next(createError(StatusCode.BadRequest_400, checkValidation(req)))   

            let user = await User.findOne({ _id: username, user_type: req.locals?.userType || 2, status: true }).select(hiddenPropertiesOption.userInfor).lean() //lean will return JS Object instead of Mongoose document

            if (!user)
                return next(createError(StatusCode.BadRequest_400, 'Số điện thoại hoặc mật khẩu không đúng')) //Should not return the detail message for client

            //Password is not correct
            const matched = await bcrypt.compareSync(password + user.salt, user.password)

            if (!matched)
                return next(createError(StatusCode.BadRequest_400, 'Số điện thoại hoặc mật khẩu không đúng'))

            //Account is correct: create access token and refresh token
            const accessToken = await jwt.sign({ username: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '10h' })
            const refreshToken = await jwt.sign({ username: user._id }, process.env.REFRESH_TOKEN_SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '168h' })
            await this.setTokenToRedis(`refresh:${user._id}`, refreshToken, 7)
            
            res.cookie('access_token', accessToken, {
                httpOnly: true, //Config cookie just accessed by server
                signed: true, //Cookie secure, prevents client-side modifications
                maxAge: 10 * 60 * 60 * 1000, //Expires after 10 hours
                // sameSite: 'none',
                // secure: true // Cookies are only transmitted over a secure channel (eg: https protocol)
            })

            delete user.password //Remove data unneccessary before send to client
            delete user.salt //Delete just working with JS Object (not Mongoose Document type)
            
            return res.status(StatusCode.OK_200).json({
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
            if (checkValidation(req) !== null) return next(createError(StatusCode.BadRequest_400, checkValidation(req)))      

            const checkDuplicateUsername = await User.findOne({ _id: username, user_type : 2, status: true })
          
            if (checkDuplicateUsername)
                return next(createError(StatusCode.Forbidden_403, 'Số điện thoại đã tồn tại'))    

            //Create new user
            let newUser = new User({
                _id: username, full_name, user_type: 2, role: 'customer', password: password, phone_number: username
            })    

            newUser = await newUser.save() // password will be hashed before save in DB (middleware of mongoose)

            if (!newUser)
                return next(createError(StatusCode.Forbidden_403, 'Đã xảy ra lỗi khi tạo người dùng'))  

            producer.sendQueue('gateway-notification', {
                userId: username,
                user_type: 2,
                role: 'customer'
            })

            return res.status(StatusCode.OK_200).json({
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

            const client = null //await clientRedis()
            // if (!client) return next(createError(StatusCode.InternalServerError_500, 'Xảy ra lỗi khi kết nối Redis'))
            if (client) {
                const refreshToken = await client.get(`refresh:${username}`)
                await client.quit()
                if (!refreshToken || refreshToken !== req.body.refresh_token) return next(createError(StatusCode.BadRequest_400, 'Token đã bị thu hồi hoặc không hợp lệ!'))
            }

            const accessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '10h' })
    
            res.cookie('access_token', accessToken, {
                httpOnly: true, //Config cookie just accessed by server
                signed: true, //Cookie secure, prevents client-side modifications
                maxAge: 10 * 60 * 60 * 1000, //Expires after 10 hours
                // sameSite: 'none',
                // secure: true // Cookies are only transmitted over a secure channel (eg: https protocol)
            })    
                
            return res.status(StatusCode.OK_200).json({
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
            //Using redis to delete token in cache
            const client = null//await clientRedis()
            if (client && req.user._id) {
                client.del(`refresh:${req.user._id}`)
            }
            await client.quit()
            //Simply delete the access token stored on the client-side cookie and redirect to the desired page. JWT does not provide a method to delete access tokens on the server (unless using a blacklist, which is not really necessary).
            res.clearCookie('access_token')

            //Xóa refresh token trong cache hoặc db
            
            return res.redirect(302, '/')
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    createEmployeeeAccount = async (req, res, next) => {
        try {
            const { username, password, full_name, role, position, experience, grants, address, ... rest } = req.body || null

            let gender = req.body.gender
            if (gender === 'nam') gender = 'Male'
            else if (gender === 'nữ') gender = 'Female'

            if (checkValidation(req) !== null)      
                return next(createError(StatusCode.BadRequest_400, checkValidation(req))) 

            //Check whether username is exist or not
            const checkDuplicateUsername = await User.findOne({ _id: username, user_type : 1, status: true })
          
            if (checkDuplicateUsername)
                return next(createError(StatusCode.BadRequest_400, 'Số điện thoại đã tồn tại'))

            //If role is other, we need to create new role with other power
            if (role === 'other') 
                await this.createNewRole(grants)
            
            const employee = { position, experience }

            //Password will be hash in mongoose's middleware
            let newUser = new User({ _id: username, password, full_name, user_type: 1, role, employee, isVerifyEmail: true, phone_number: username, gender, address })    
            newUser = await newUser.save()

            if (!newUser)
                return next(createError(StatusCode.Forbidden_403, 'Đã xảy ra lỗi khi tạo người dùng'))  

            producer.sendQueue('gateway-notification', {
                userId: username,
                user_type: 1,
                role: role
            })

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: `Tài khoản ${username} được tạo thành công`
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    createNewRole = async (grants) => {
        try {
            if (!grants)
                return next(createError(StatusCode.BadRequest_400, 'Vui lòng nhập các quyền của nhân viên'))

            const uniqueString = uuidv4()

            await new Role({
                name: uniqueString,
                grants: grants
            }).save()
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    async getResourceRbac(req, res, next) {
        try {
            //Read data from local file
            const resourceRbacData = JSON.parse(fs.readFileSync(join(process.cwd(), './references/resource.rbac.json')).toString())

            //console.log(resourceRbacData)
            //console.log(resourceRbacData[0].actions)
            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy danh sách các quyền thành công',
                data: resourceRbacData
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    //Employee or customer
    async updateUser (req, res, next) {
        try {
            if (!req.user || !req.user?._id)
                return next(createError(StatusCode.Unauthorized_401, 'Đã xảy ra lỗi, vui lòng kiểm tra trạng thái đăng nhập'))
        
            //Check validation inputs from body
            if (checkValidation(req) !== null)      
                return next(createError(StatusCode.BadRequest_400, checkValidation(req))) 
            
            if (req.body.gender && req.body.gender == 'nam') {
                req.body.gender = 'Male'
            }
            else if (req.body.gender && req.body.gender == 'nữ') {
                req.body.gender = 'Female'
            }

            const resultUpdate = await User.findOneAndUpdate({ _id: req.user._id, user_type: req.locals.userType, status: true }, req.body)

            if (!resultUpdate)
                return next(createError(StatusCode.BadRequest_400, 'Đã xảy ra lỗi khi cập nhật thông tin'))
        
            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Cập nhật thông tin tài khoản thành công'
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
    async getEmployeees (req, res, next) {
        try {
            const users = await User.find({ user_type: 1, status: true }).select(hiddenPropertiesOption.employeesList)

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Lấy danh sách nhân viên thành công',
                data: users
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    setTokenToRedis = async (userId, token, dayNum) => {
        const client = null; //await clientRedis()
        // if (!client) throw new Error('Xảy ra lỗi khi kết nối Redis')
        if (client) {
            await client.set(userId, token, { EX: 60 * 60 * 24 * dayNum }) //Ex is second
            await client.quit()
        }
    }

    async verifyEmail (req, res, next) {
        try {
            let { email }= req.body
            if (!email) email = req.user.email
            if (!email)
                return next(createError(StatusCode.BadRequest_400, 'Thiếu thông tin email'))
            const otp = generateOtp()

            const client = null //await clientRedis()
            if (client) {
                await client.set(`email:${req.user._id}`, otp, { EX: 60 * 5 }) //Ex is second
                await client.quit()
            }
            // return next(createError(StatusCode.InternalServerError_500, 'Xảy ra lỗi khi kết nối Redis'))    

            producer.sendQueue('email', {
                action: 'verify',
                otp: otp,
                email: email
            })

            await User.findOneAndUpdate({ _id: req.user._id, status: true }, {
                email: email
            })

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: `Gửi OTP thành công đến email ${email}, otp có hiệu lực trong 5 phút`,
                data: {
                    userId: req.user._id
                }
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    async verifyOtpEmail (req, res, next) {
        try {
            const { userId, otp } = req.body
            const client = null //await clientRedis()
            if (client) {
                const otpRedis = await client.get(`email:${userId}`)
                // console.log(otpRedis)
    
                if (otpRedis != otp) 
                    return next(createError(StatusCode.BadRequest_400, 'Mã xác thực không đúng'))
            }
            // return next(createError(StatusCode.InternalServerError_500, 'Xảy ra lỗi khi kết nối Redis'))    

            const user = await User.findOneAndUpdate({ _id: userId, status: true }, {
                isVerifyEmail: true
            })

            producer.sendQueue('email', {
                action: 'add',
                userId: userId,
                email: user.email
            })

            client.del(`email:${userId}`)
            await client.quit()

            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Xác thực email thành công'
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    findOrCreateUserGoogle = async (profile) => {
        try {
            const username = `google:${profile.id}`
            const displayName = profile.displayName
            const email = profile.emails[0]?.value

            const user = await User.findOne({ _id: username, status: true }).select(hiddenPropertiesOption.userInfor).lean()
            if (user) return user
           
            const newUser = await User.insertMany([{
                _id: username,
                full_name: displayName,
                user_type: 2,
                role: 'customer',
                email: email,
                isVerifyEmail: true
            }])

            if (!newUser)
                return new Error('Đã xảy ra lỗi khi tạo mới người dùng')

            producer.sendQueue('gateway-notification', {
                userId: username,
                user_type: 2,
                role: 'customer'
            })

            return newUser 
        }
        catch (err) {
            return new Error(err.message)
        }
    }

    authenticateGoogle = async (req, res, next) => {
        try {
            passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    authenticateGoogleCallback = async (req, res, next) => {
        try {
            passport.authenticate('google', { failureRedirect: `${process.env.FRONT_END_URL}/login` },
            async function(error, user, infor) {
                if (error) return next(createError(StatusCode.BadRequest_400, `Đã xảy ra lỗi khi gọi đăng nhập Google: ${error.message}`))
                const accessToken = await jwt.sign({ username: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '10h' })
                const refreshToken = await jwt.sign({ username: user._id }, process.env.REFRESH_TOKEN_SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '168h' })
                //await this.setTokenToRedis(`refresh:${user._id}`, refreshToken, 7)
                    
                res.cookie('access_token', accessToken, {
                    httpOnly: true, //Config cookie just accessed by server
                    signed: true, //Cookie secure, prevents client-side modifications
                    maxAge: 10 * 60 * 60 * 1000, //Expires after 10 hours
                    // sameSite: 'none',
                    // secure: true // Cookies are only transmitted over a secure channel (eg: https protocol)
                })

                const data = {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    user: user
                }
    
                // Successful authentication
                res.redirect(`${process.env.FRONT_END_URL}/google?data=${encodeURIComponent(JSON.stringify(data))}`)    

                // return res.status(StatusCode.OK_200).json({
                //     status: 'success',
                //     message: 'Đăng nhập Google thành công',
                //     data: {
                //         access_token: accessToken,
                //         refresh_token: refreshToken,
                //         data: user
                //     }
                // })
            })(req, res, next)
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    loginTmsAccount = async (req, res, next) => {
        try {
            const { username, password } = req.body || null

            if (checkLogin.checkLoginTms(username, password, process.env.TMS_USERNAME, process.env.TMS_PASSWORD) === false)  return next(createError(StatusCode.BadRequest_400, 'Username or password is not correct'))

            const accessToken = await jwt.sign({ username: username }, process.env.TMS_ACCESS_SECRET || '', { algorithm: 'HS256', expiresIn: '10h' })
            const refreshToken = await jwt.sign({ username: username }, process.env.TMS_REFRESH_SECRET || '', { algorithm: 'HS256', expiresIn: '168h' })
            await this.setTokenToRedis(`refresh:${username}`, refreshToken, 7)
            
            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Login successfully',
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken
                }
            })
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getTokenFromRefresh = async (req, res, next) => {
        try {
            if (!req.body.refresh_token) return next(createError(StatusCode.BadRequest_400, 'Refresh token is empty'))

            const decodeRefreshToken = await verify(req.body.refresh_token, process.env.TMS_REFRESH_SECRET || '')

            if (!decodeRefreshToken) return next(createError(StatusCode.BadRequest_400, 'Refresh token is not valid or expired'))

            const username = decodeRefreshToken.username

            if (!username) return next(createError(StatusCode.BadRequest_400, 'Error occured when decoded token'))

            const accessToken = jwt.sign({ username: username }, process.env.TMS_ACCESS_SECRET || '', { algorithm: 'HS256', expiresIn: '10h' })
                
            return res.status(StatusCode.OK_200).json({
                status: 'success',
                message: 'Get new access token successfully',
                token: accessToken,
            })   
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }

    getUserList = async (req, res, next) => {
        try {
            if (req.body?.token !== process.env.TOKEN_USER_LIST) {
                return next(createError(StatusCode.BadRequest_400, 'Token is not valid')) 
            }
            const users = await User.find({ status: true }).select({
                _id: 1,
                gender: 1,
                birthday: 1
            }).lean()

            const newFormatUsers = users.map(value => {
                const dateObj = new Date(value.birthday)
                let formattedDate
                if (!isNaN(dateObj.getTime())) {
                    const year = dateObj.getFullYear()
                    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
                    const day = dateObj.getDate().toString().padStart(2, '0')
                    formattedDate = `${year}-${month}-${day}`
                }
                return {
                    ...value,
                    birthday: formattedDate || ''
                }
            })
            
            return res.status(StatusCode.OK_200).json(newFormatUsers)
        }
        catch (err) {
            return next(createError(StatusCode.InternalServerError_500, err.message)) 
        }
    }
}

module.exports = new UserService()