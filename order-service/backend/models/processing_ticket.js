const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const Processing_tickets = new Schema (
    {
        // _id: { type: Schema.Types.ObjectId } , //references
        url_ticket: { type: String },
        print_times: { type: Number, default: 1 },
        ticket_type: { type: Number }
    }, {
        timestamps: true,
        collection: 'processing_tickets'
    }
)

module.exports = mongoose.model('Processing_tickets', Processing_tickets);