const Account = require('../schemas/Account')
const User = require('../schemas/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class AccountService {
    async loginAccount (req, res, next) {
        const { username, password, account_type } = req.body

        //Check validation inputs
        let result = validationResult(req)
        if (result.errors.length != 0) {
            result = result.mapped()
            let message 
            for (let i in result) {
                message = result[i].msg
                break //Just get first message error
            }
            return res.status(400).json({
                status: 'error',
                message
            })
        }

        try {
            let account = await Account.findOne({ _id: username, account_type: account_type })

            //Account is not exist
            if (!account) {
                return res.status(400).json({ status: 'error', message: 'Email or password is incorrect' })
            }

            //Password is not correct
            const matched = await bcrypt.compareSync(password, account.password)

            if (!matched) {
                return res.status(400).json({ status: 'error', message: 'Email or password is incorrect' })
            }

            //Account is correct: create access token and refresh token
            const accessToken = jwt.sign({ username: account.username }, process.env.ACCESS_TOKEN_SECRET_KEY, { algorithm: 'HS256', expiresIn: '10h' })
            const refreshToken = jwt.sign({ username: account.username }, process.env.REFRESH_TOKEN_SECRET_KEY)

            res.cookie('access_token', accessToken, {
                //Config cookie just accessed by server
                httpOnly: true,
            })
            
            return res.status(200).json({
                status: 'success',
                message: 'Login successfully',
                data: {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                }
            })
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            })
        }
    }

    async signupAccount (req, res, next) {
        const { username, password, full_name } = req.body || null

        //Check validation inputs
        let result = validationResult(req)
        if (result.errors.length != 0) {
            result = result.mapped()
            let message 
            for (let i in result) {
                message = result[i].msg
                break //Just get first message error
            }
            return res.status(400).json({
                status: 'error',
                message
            })
        }

        try {
            //Check whether username is exist or not
            const checkDuplicateUsername = await Account.findOne({ _id: username, account_type : 1 })

            if (checkDuplicateUsername)
                return res.status(403).json({
                    status: 'error',
                    message: 'account already exists'
                })
            
            //Create new user
            let newUser = new User({
                full_name: full_name,
                user_type: 1
            })    
            newUser = await newUser.save()

            //encrypt the new account's password
            const hashPassword = await bcrypt.hashSync(password, 10)

            let newAccount = new Account({
                _id: username,
                password: hashPassword,
                user_id: newUser._id,
                account_type: 1
            })
            newAccount = await newAccount.save()

            return res.status(200).json({
                status: 'success',
                message: `Account ${username} is created successfully`
            })
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            })
        }
    }
}

module.exports = new AccountService()
