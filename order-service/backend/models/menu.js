const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const menu = new Schema (
    {
        _id: { type: Number } , //ID means username (login with username or google or facebook)
        name: { type: String },
        description: { type: String },
        image: { type: String },
        price: { type: Number },
        status: { type: Boolean },
        category_id: { type: Number },
        discount_price: { type: Number },
    }, {
        collection: 'menus'
    }
)

module.exports = mongoose.model('Menu', menu);