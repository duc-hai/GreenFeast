const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const account = new Schema (
    {
        _id: {type: String}, //Override mongoose _id, _id is represent for username below 
        //username: {type: String, required: true, unique: true},
        password: {type: String},
        account_type: {type: Number, required: true},
        user_id: {type: String, required: true, unique: true}
    },
)

// account.methods.findAccount = function (callback) {
//     return mongoose.model('Account').find({}, callback)
// }

module.exports = mongoose.model('Account', account);