const mongoose = require('mongoose')

const Schema = mongoose.Schema

const user = new Schema (
    {   
        _id: { type: String },
        email: { type: String, unique: true },
        user_type: { type: Number, default: 2}
    }, {
        timestamp: true,
        collection: 'users'
    }
)

module.exports = mongoose.model('Users', user);