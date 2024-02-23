const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const account = new Schema (
    {
        _id: { type: String } , //ID means username (login with username or google or facebook)
        password: { type: String },
        account_type: { type: Number, required: true }, //1 is restaurarnt side, 2 is customer
        user_id: { type: Schema.Types.ObjectId, required: true, unique: true }, 
    }, {
        timestamps: true, //format ISO 8601
        //To convert to a readable date and time, use 'new Date(isoString)'
        collection: 'accounts'
    }
)

// account.methods.findAccount = function (callback) {
//     return mongoose.model('Account').find({}, callback)
// }

module.exports = mongoose.model('Account', account);