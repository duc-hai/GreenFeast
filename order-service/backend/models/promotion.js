const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const promotion = new Schema (
    {
        _id: { type: Number }, 
        name: { type: String },
        status: { type: Boolean },
        note: { type: String },
        description: { type: String }, 
        condition_apply: { type: Number }, 
        promotion_value: { type: String },
        start_at: { type: Date },
        end_at: { type: Date }    
    }, 
    {
        collection: 'promotions'
    }
)

module.exports = mongoose.model('Promotion', promotion);