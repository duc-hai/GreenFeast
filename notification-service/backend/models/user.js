const mongoose = require('mongoose')

const Schema = mongoose.Schema

const user = new Schema (
    {   
        _id: { type: String },
        email: { type: String },
        user_type: { type: Number, default: 2 }
    }, {
        timestamps: true,
        collection: 'users'
    }
)

module.exports = mongoose.model('Users', user);