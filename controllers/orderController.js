const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { errorHandler } = require('../auth');
const Cart = require('../models/Cart'); 


module.exports.createOrder = (req, res) => {
    return User.findById(req.user.id).select('-created_at -updated_at')
    .then(user => {
        if(!user){
            return res.status(404).send({ message: "User not found" })
        }
        if(user.isAdmin === true){
            return res.status(403).send({ message: "Forbidden action" })
        }

        return Cart.findOne({ userId: user.id })
        .populate('cartItems.productId')
        .then(cart => {
            if(!cart){
                return res.status(404).send({ message: "No cart found" })
            }
            if(cart.cartItems.length === 0){
                return res.status(400).send({ message: "No Items to Checkout" })
            }

            const newOrder = new Order({
                userId: req.user.id,
                productsOrdered: cart.cartItems,
                totalPrice: cart.totalPrice
            })

            return newOrder.save()
            .then(order => {
                return Cart.findByIdAndDelete(cart.id);
                })
            .then(() => {
                return res.status(201).send({ 
                    message: "Ordered successfully"
             })
           })
        })
    })
    .catch(err => res.status(500).send({ message: "Internal server error", error: err.message }))
}


module.exports.getUserOrders = (req, res) => {
    Order.find({ userId: req.user.id })
    .populate('productsOrdered.productId')
    .select('-updated_at -createdOn')
    .then(orders => {
        if(orders.length === 0){
            return res.status(404).send({ message: "No orders found" })
        }
        return res.status(200).send({ orders: orders })
    })
    .catch(error => errorHandler(error, req, res))
}




module.exports.getAllOrders = (req, res) => {
    Order.find({})
    .populate('productsOrdered.productId')
    .populate('userId')
    .sort('-createdAt')  // empty filter = all orders
    .limit(50)
    .then(orders => {
        return res.status(200).send({ orders: orders })
    })
    .catch(err => res.status(500).send({ message: "Internal server error", error: err.message }))
}





