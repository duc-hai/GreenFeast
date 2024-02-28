const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const order = new Schema (
    {
        // _id: { type: Schema.Types.ObjectId } , 
        name: { type: String },
        order_detail: [
            {
                menu: [
                    {
                        _id: { type: Number },
                        quantity: { type: Number },
                        price: { type: Number },
                        note: { type: String }
                    }
                ],
                time: { type: Date },
                order_person: { 
                    _id: { type: Schema.Types.ObjectId },
                    name: { type: String }
                } 
            }
        ],
        subtotal: { type: Number },
        discount: { type: Number, default: 0 },
        surcharge: { type: Number, default: 0 },
        note: { type: String },
        total_bill: { type: Number },
        table: { type: String },
        checkin: { type: Date },
        checkout: { type: Date },
        payment_method: { type: String },
        status: { type: Boolean }
    }, {
        collection: 'orders'
    }
)

module.exports = mongoose.model('Order', order);