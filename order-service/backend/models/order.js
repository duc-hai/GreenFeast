const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const order = new Schema (
    {
        // _id: { type: Schema.Types.ObjectId } , 
        order_detail: [
            {
                menu: [
                    {
                        _id: { type: Number },
                        name: { type: String },
                        quantity: { type: Number },
                        price: { type: Number },
                        note: { type: String },
                        processing_status: { type: Number, default: 0 }
                    }
                ],
                time: { type: Date },
                order_person: { 
                    _id: { type: String },
                    name: { type: String }
                } 
            }
        ],
        subtotal: { type: Number },
        discount: { type: Number, default: 0 },
        surcharge: { type: Number, default: 0 },
        note: { type: String },
        total: { type: Number },
        table: { type: String },
        checkin: { type: Date },
        checkout: { type: Date },
        payment_method: { type: String },
        status: { type: Boolean }, //true is paid, means closed table
        is_rating: { type: Boolean, default: false }
    }, {
        collection: 'orders'
    }
)

module.exports = mongoose.model('Order', order);