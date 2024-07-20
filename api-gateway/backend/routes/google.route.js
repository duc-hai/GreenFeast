const express = require('express')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const userService = require('../services/user.service')
const router = express.Router()
require('dotenv').config() 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, async function(accessToken, refreshToken, profile, callback) {
        try {
            const user = await userService.findOrCreateUserGoogle(profile)
            return callback(null, user)
        }
        catch (err) {
            return callback(err)
        }
    }
)) 

// passport.serializeUser((user, done) => {
//     done(null, user)
// })
  
// passport.deserializeUser((user, done) => {
//     done(null, user)
// })

// /auth/google
router.get('/', userService.authenticateGoogle)

//  /auth/google/callback
router.get('/callback', userService.authenticateGoogleCallback)

module.exports = router