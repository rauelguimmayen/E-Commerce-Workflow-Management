const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    description: {
        type: String,
    },
    category:       {
      type: String,
      enum: ['clothing', 'electronics', 'accessories', 'footwear', 'home', 'sports', 'toys & games'],
      required: true
    },
    price: {
        type: Number,
        required: true,
    },
    image_url:  { 
    type: String,
    default: null 
    },
    stock:      { 
    type: Number, 
    default: 0, 
    min: 0 
    },
    is_featured:{ 
    type: Boolean, 
    default: false 
    },
    tags:       [{ type: String }],
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