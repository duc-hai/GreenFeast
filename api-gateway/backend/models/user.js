const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const generateKey = require('../helpers/generate.key')

const SALT_ROUND = 10
const Schema = mongoose.Schema
 
const userSchema = new Schema (
    {
        _id: { type: String } , //ID means username (login with phone number or google)
        password: { type: String },
        salt: { type: String },
        full_name: { type: String },
        birthday: { type: Date },
        gender: { type: String, default: 'không' },
        phone_number: { type: String, maxLength: 11, default: '' },
        email: { type: String },
        address: { type: String, default: '' },
        
        role: { type: String, ref: 'roles' },

        user_type: { type: Number, type: Number, enum: [1, 2]}, //1 is restaurarnt side, 2 is customer

        status: { type: Boolean, default: true }, //true is active, false is inactive
       
        employee: {
            position: { type: String }, //default: 'Nhân viên phục vụ' 
            experience: { type: String }, //default: 'Không kinh nghiệm' 
            workday: { type: Date }, //default: Date.now 
        },

        customer: {
            accumulated_points: { type: Number },
            order_id_history : { type : Array },
        },

        refresh_token: { type: String }, //CONSIDER HERE 
    }, {
        timestamps: true, //format ISO 8601 //create "createdAt & updatedAt" //To convert to a readable date and time, use 'new Date(isoString)'
        collection: 'users'
    }
)

//Mongoose's middleware
userSchema.pre('save', async function (next) {
    try {
        const user = this //get context is current document

        //We will merge password with our salt, one more step from our app and salt of bcrypt to ensure security
        const salt = generateKey(16) //According to current security standards: at least 16 bytes
        const passwordAttachSalt = user.password + salt
        user.salt = salt
    
        //encrypt the new account's password
        const hashPassword = await bcrypt.hashSync(passwordAttachSalt, SALT_ROUND) //10 is saltRound, this an important argument. Because an attacker can use brute force to hack an account even though the password hashed, it is necessary to randomly generate a string of characters which call "salt" to add to the password and save it in the database.        

        user.password = hashPassword
        user.status = true

        next()
    }
    catch (err) {
        next(err)
    }
})

module.exports = mongoose.model('User', userSchema);