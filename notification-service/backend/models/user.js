const mongoose = require('mongoose')

const Schema = mongoose.Schema

const user = new Schema (
    {   
        _id: { type: String },
        email: { type: String, unique: true }
    }, {
        timestamp: true,
        collection: 'users'
    }
)

module.exports = mongoose.model('Users', user);