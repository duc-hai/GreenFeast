const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const review = new Schema (
    {
        count: { type: Number, default: 1 },
        menu_id: { type: Number, required: true },
        page: { type: Number },
        reviews: [
            {
                user_id: { type: String, required: true },
                user_name: { type: String, required: true },
                order_id: { type: mongoose.Types.ObjectId, required: true },
                rating: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
                comment: { type: String },
                timestamp: { type: Date, default: Date.now() },
                is_show: { type: Boolean, default: true }
            }
        ]
    }, 
    {
        collection: 'reviews',
        timestamps: true
    }
)

module.exports = mongoose.model('Review', review);