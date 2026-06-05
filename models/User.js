const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

	firstName: {
        type: String,
        required: [true, 'First Name is Required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is Required']
    },
    email: {
	    type: String,
	    required: [true, 'Email is Required'],
	    unique: true,
	    //match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"] 
	},
	password: {
        type: String,
        required: [true, 'Password is Required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile Number is Required'],
        minlength: [11, "Mobile number Invalid"],
        maxlength: [11, "Mobile number Invalid"]
    }    
},
{
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at' 
}}
)

module.exports = mongoose.model('User', userSchema);