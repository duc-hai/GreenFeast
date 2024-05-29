const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const category = new Schema (
    {
        _id: { type: Number }, 
        name: { type: String },
    }, {
        collection: 'categories'
    }
)

module.exports = mongoose.model('Category', category);