const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updated_at'
    }
}
)

module.exports = mongoose.model('Product', productSchema);