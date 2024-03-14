const express = require('express')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const Account = require('../models/account')
const User = require('../models/user')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const router = express.Router()

require('dotenv').config() 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, async function(accessToken, refreshToken, profile, cb) {
        const idToSaveDatabase = `google:${profile.id}`

        const existAccount = await Account.findOne({ _id: idToSaveDatabase })

        if (existAccount)
            return cb (null, existAccount)
        else {
            const newUser = await new User({
                full_name: profile.displayName,
                user_type: 2,
                role: 'customer'
            }).save()
            
            const newAccount = await new Account({
                _id: idToSaveDatabase,
                user_id: newUser._id,
                account_type: 2
            }).save()

            return cb (null, newAccount)
        }
    }
)) 

passport.serializeUser((user, done) => {
    done(null, user)
})
  
passport.deserializeUser((user, done) => {
    done(null, user)
})

//  /auth/google
router.get('/', passport.authenticate('google', { scope: ['profile'] }))

//  /auth/google/callback
router.get('/callback', 
    passport.authenticate('google', { failureRedirect: '/signin' }),
    async function(req, res) {
        try {
            const accessToken = await jwt.sign({ username: req?.user?.user_id }, process.env.ACCESS_TOKEN_SECRET_KEY || '', { algorithm: 'HS256', expiresIn: '10h' })

            res.cookie('access_token', accessToken, {
                httpOnly: true, //Config cookie just accessed by server
                signed: true, //Cookie secure, prevents client-side modifications
                maxAge: 10 * 60 * 60 * 1000, //Expires after 10 hours
                sameSite: 'none',
                secure: true // Cookies are only transmitted over a secure channel (eg: https protocol)
            })

            const userInfor = await User.findOne({ _id: req?.user?.user_id })

            if (userInfor)
                res.cookie('full_name', userInfor.full_name)

            // Successful authentication
            res.redirect(`${process.env.FRONT_END_URL}/`)
        }
        catch (err) {
            return next([400, 'error', err.message])
        }
    }
)

module.exports = router