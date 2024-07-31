const mongoose = require('mongoose')

const Schema = mongoose.Schema

const notification = new Schema (
    {   
        userId: { type: String },
        title: { type: String },
        message: { type: String },
        isRead: { type: Boolean, default: false },
        link: { type: String, default: '' },
    }, {
        timestamp: true,
        collection: 'notifications'
    }
)

module.exports = mongoose.model('Notifications', notification);