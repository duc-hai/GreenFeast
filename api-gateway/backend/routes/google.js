const express = require('express')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const Account = require('../models/account')
const User = require('../models/user')
const passport = require('passport')

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
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication
        res.redirect('/')
    }
)

module.exports = router