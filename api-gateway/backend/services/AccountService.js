const Account = require('../schemas/Account')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class AccountService {
    async loginAccount (req, res, next) {
        const { username, password, account_type } = req.body
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
            let account = await Account.findOne({ username: username, account_type: account_type })

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
                access_token: accessToken,
                refresh_token: refreshToken,
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
