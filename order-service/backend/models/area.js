const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const area = new Schema (
    {
        _id: { type: Number } , 
        name: { type: String },
        price_percentage: { type: Number },
        description: { type: String },
        table_list: [
            {
                _id: { type: String },
                status: { type: Number }, //0 is available, 1 is serve and 2 is reserver
                slug: { type: String }
            }
        ]
    }, {
        collection: 'areas'
    }
)

module.exports = mongoose.model('Area', area);