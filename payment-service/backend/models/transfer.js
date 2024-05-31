const mongoose = require('mongoose')

const Schema = mongoose.Schema

const transferSchema = new Schema (
    {
        _id: { type: String },
        amount: { type: Number },
        bank_code: { type: String },
        bank_transaction_number: { type: String },
        card_type: { type: String },
        order_id: { type: mongoose.SchemaTypes.ObjectId },
        order_infor: { type: String },
        response_code: { type: String },
        pay_time: { type: Date }
    }, {
        timestamp: true,
        collection: 'transfers'
    }
)

module.exports = mongoose.model('Transfer', transferSchema);