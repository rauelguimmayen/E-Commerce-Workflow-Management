const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({

	userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',        
        required: true
    },
    productsOrdered: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Product ID is required']
            },
            quantity: {
                type: Number,
                required: true
            },
            subtotal: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
    type: String,
    default: 'pending' 
    }
},
{
    timestamps: {
        createdAt: 'orderedOn',
        updatedAt: 'updated_at'
    }
}
)

module.exports = mongoose.model('Order', orderSchema);