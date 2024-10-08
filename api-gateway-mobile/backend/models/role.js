//Authorization resources, allowing which role have access which resource
const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const role = new Schema (
    {
        name: { type: String, require: true, unique: true },
        description: { type: String },
        grants: [
            {
                resource: { type: String, required: true },
                actions: [
                    { type: String, required: true }
                ]
            }
        ]
    }, {
        timestamps: true,
        collection: 'roles'
    }
)

module.exports = mongoose.model('Role', role);