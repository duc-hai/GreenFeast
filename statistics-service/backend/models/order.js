const mongoose = require('mongoose')

const Schema = mongoose.Schema

const order = new Schema (
    {   
        menu_detail: [
            {
                _id: { type: Number },
                name: { type: String },
                quantity: { type: Number },
                price: { type: Number },
            }
        ],
        subtotal: { type: Number },
        discount: { type: Number, default: 0 },
        surcharge: { type: Number, default: 0 },
        note: { type: String },
        total: { type: Number },
        table: { type: String },
        checkout: { type: Date },
        payment_method: { type: String },
    }, {
        collection: 'orders'
    }
)

module.exports = mongoose.model('Orders', order);