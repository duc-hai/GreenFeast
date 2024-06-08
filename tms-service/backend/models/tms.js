const mongoose = require('mongoose')
const bcrypt= require('bcrypt')

const SALT_ROUND = 10
const Schema = mongoose.Schema

const tms = new Schema (
    {
        username: { type: String, unique: true },
        password: { type: String },
        access_token: { type: String },
        main_url: { type: String },
        sub_url: { type: String },
        description: { type: String },
        isDeleted: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true }
    }, {
        timestamp: true,
        collection: 'tmss'
    }
)

//Mongoose's middleware
tms.pre('save', async function (next) {
    try {
        const user = this //get context is current document

        //encrypt the new account's password
        const hashPassword = await bcrypt.hashSync(user.password, SALT_ROUND) //10 is saltRound, this an important argument. Because an attacker can use brute force to hack an account even though the password hashed, it is necessary to randomly generate a string of characters which call "salt" to add to the password and save it in the database.    

        user.password = hashPassword
        
        next()
    }
    catch (err) {
        next(err)
    }
})

module.exports = mongoose.model('Tmss', tms);