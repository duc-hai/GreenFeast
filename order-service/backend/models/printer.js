const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const printer = new Schema (
    {
        _id: { type: Number } , 
        name: { type: String },
        ip_address: { type: String },
        printer_type: { type: Number },
        area_id: { type: Number }
    }, {
        collection: 'printers'
    }
)

module.exports = mongoose.model('Printer', printer);