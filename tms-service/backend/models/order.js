const mongoose = require('mongoose')

const Schema = mongoose.Schema

const order = new Schema (
    {
        menu_detail: [
            {
                _id: { type: Number },
                name: { type: String },
                quantity: { type: Number },
            }
        ],
        shipping_fee: { type: Number },
        note: { type: String },
        total: { type: Number },
        payment_method: { type: String },
        delivery_information: {
            name: { type: String },
            phone_number: { type: String },
            district: { type: String },
            ward: { type: String },
            street: { type: String }
        },
        cod_amount: { type: Number },
        status: { type: Number },
        delivery_notes: { type: String, default: '' },
        send_tms: { type: Boolean, default: false },
        delivery_person: {
            name: { type: String },
            phone: { type: String }
        }
    }, {
        timestamps: true,
        collection: 'orders'
    }
)

module.exports = mongoose.model('Orders', order);