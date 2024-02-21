const mongoose = require('mongoose')

const Schema = mongoose.Schema
 
const user = new Schema (
    {
        full_name: { type: String },
        birthday: { type: Date },
        gender: { type: String, default: 'None' },
        phone_number: { type: String, maxLength: 11, default: '' },
        address: { type: String, default: '' },
        
        role : { type: String },

        user_type: { type: Number, type: Number, enum: [1, 2]}, //1 is restaurarnt side, 2 is customer
       
        employee: {
            position: { type: String }, //default: 'Nhân viên phục vụ' 
            experience: { type: String }, //default: 'Không kinh nghiệm' 
            day_work: { type: Date }, //default: Date.now 
        },

        customer: {
            email: { type: String },
            accumulated_points: { type: Number },
            order_list : { type : Array },
        },
    }, {
        timestamps: true,
        collection: 'users'
    }
)

module.exports = mongoose.model('User', user);