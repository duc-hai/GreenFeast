const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const user = new Schema (
    {
        full_name: { type: String },
        birthday: { type: Date },
        gender: { type: String, default: "None" },
        phone_number: { type: String, maxLength: 11 },
        address: { type: String },
        role : { type: Number },

        employee: {
            position: { type: String },
            access: { type: String }, //Temporary
            experience: { type: String },
            day_work: { type: Date, default: Date.now },
        },

        customer: {
            email: { type: String },
            accumulated_points: { type: Number },
            order_list : { type : Array },
        },
        
        // applied: [
        //     {
        //         id: String,
        //         recomdLetter: String,
        //         response: {
        //             code: Number,
        //             message: String,
        //         }
        //     }
        // ]
    },
)

module.exports = mongoose.model('User', user);