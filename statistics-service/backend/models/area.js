const mongoose = require('mongoose')

const Schema = mongoose.Schema

const area = new Schema (
    {   
        _id: { type: Number },
        name: { type: String },
        table_list: { type: [String] }
    }, {
        collection: 'areas'
    }
)

module.exports = mongoose.model('Areas', area);