const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const menu = new Schema (
    {
        _id: { type: Number } , 
        name: { type: String },
        description: { type: String },
        image: { type: String },
        price: { type: Number },
        status: { type: Boolean },
        category_id: { type: Number },
        discount_price: { type: Number },
        discount_start: { type: Date },
        discount_end: { type: Date },
        menu_type: { type: Number },
        rating_sum: { type: Number, default: 0 },
        rating_count: { type: Number, default: 0 },
        rating_average: { type: Number, default: 0 },
        rating_pages: { type: Number, default: 0 }
    }, {
        collection: 'menus'
    }
)

module.exports = mongoose.model('Menu', menu);