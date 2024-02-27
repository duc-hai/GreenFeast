const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const area = new Schema (
    {
        _id: { type: Number } , //ID means username (login with username or google or facebook)
        name: { type: String },
        price_percentage: { type: Number },
        description: { type: String },
        table_list: [
            {
                _id: { type: Number },
                name: { type: String },
            }
        ]
    }, {
        collection: 'areas'
    }
)

module.exports = mongoose.model('Area', area);