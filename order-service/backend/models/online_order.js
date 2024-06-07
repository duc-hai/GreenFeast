const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const onlineOrder = new Schema (
    {
        menu_detail: [
            {
                _id: { type: Number },
                name: { type: String },
                quantity: { type: Number },
                price: { type: Number },
                note: { type: String },
            }
        ],
        subtotal: { type: Number },
        discount: { type: Number, default: 0 },
        surcharge: { type: Number, default: 0 },
        shippingfee: { type: Number, default: 0 },
        note: { type: String },
        total: { type: Number },
        time: { type: Date, default: Date.now() },
        payment_method: { type: String },
        status: { type: Number, default: 0 },
        delivery_information: {
            name: { type: String, default: '' },
            phone_number: { type: String, required: true },
            address: { type: String, required: true }
        },
        order_person: {
            _id: { type: String },
            name: { type: String }
        }
    }, {
        collection: 'online_orders'
    }
)

module.exports = mongoose.model('Online_orders', onlineOrder);