const { verify } = require('jsonwebtoken')
const Account = require('../schemas/Account.js')

exports.jwtTokenValidator = async (req, res, next) => {
    try {
        if (!req.headers.authorization && !req.headers.cookie) {
            return res.status(401).json({
                status: 'error',
                message: "Unauthorized, check your login"
            });
        }
        let accessTokenFromHeader
        if (req.headers.authorization) {
            accessTokenFromHeader = req.headers.authorization.split(" ")[1]
        }
        else if (req.headers.cookie) {
            accessTokenFromHeader = req.headers.cookie.split("=")[1]
        }
        //console.log(accessTokenFromHeader)
        if (!accessTokenFromHeader) {
            return res.status(401).json({
                status: 'error',
                message: "Unauthorized, check your login"
            });
        }

        const verified = await verify(accessTokenFromHeader, process.env.ACCESS_TOKEN)

        if (!verified) {
            return res.status(401).json({
                status: 'error',
                message: "Unauthorized, access token is not wokring"
            })
        }

        const user = await User.findById(verified.userId)
        if (user.role == 2) {
            const company = await Company.findOne({ idUser : user.id})
            req.company = company
        }
        else {
            return res.status(401).json({
                status: 'error',
                message: "Unauthorized, your role account is not suitable for this"
            })
        }
        //console.log(user);
        req.user = user

        const account = await Account.findOne({ email: verified.email })
        req.account = account
        
        return next();
    }   
    catch (err) {
        return res.status(400).json({
            status: 'error',
            message: `Error in verify access token: ${err.message}`
        })
    }
}
