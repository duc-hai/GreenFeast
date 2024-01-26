const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const account = new Schema (
    {
        username: {type: String, required: true, unique: true},
        password: {type: String},
        account_type: {type: Number, required: true},
        user_id: {type: String, required: true}
    },
)

module.exports = mongoose.model('Account', account);