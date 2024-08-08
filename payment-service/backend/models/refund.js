const mongoose = require('mongoose')

const Schema = mongoose.Schema

const refundSchema = new Schema (
    {
        _id: { type: String },
        response_code: { type: String },
        response_message: { type: String },
        tmn_code: { type: String },
        txn_ref: { type: String },
        amount: { type: Number },
        content: { type: String },
        bank_code: { type: String },
        user_id: { type: String }
    }, {
        timestamps: true,
        collection: 'refunds'
    }
)

module.exports = mongoose.model('Refund', refundSchema);