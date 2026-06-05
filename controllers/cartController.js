const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { errorHandler } = require('../auth');

// ─── GET /cart/get-cart ─────────────────────────────────────────────────────────────
module.exports.getCart = async (req, res) => {
 
    let cart = await Cart.findOne({ userId: req.user.id })
    .populate('cartItems.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, cartItems: [], totalPrice: 0 });
    }
    if (cart.cartItems.length === 0) {
      return res.status(200).send({ message: "No items in Cart" });
    }
    res.json({ cart }).catch(error => errorHandler(error, req, res));
};
// ─── POST /cart/add-to-cart ────────────────────────────────────────────────────────────
// Body: { productId, quantity }
module.exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, subtotal } = req.body;

    if (!productId || !quantity || !subtotal) {
      return res.status(400).json({ success: false, message: 'productId, quantity, and subtotal are required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, cartItems: [], totalPrice: 0 });
    }

    const existingIdx = cart.cartItems.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingIdx > -1) {
      cart.cartItems[existingIdx].quantity += Number(quantity);
      cart.cartItems[existingIdx].subtotal += Number(subtotal);
    } else {
      cart.cartItems.push({
        productId,
        quantity: Number(quantity),
        subtotal: Number(subtotal),
      });
    }

    cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    await cart.save();

    res.json({ cart });
  } catch (err) {
    next(err);
  }
};


module.exports.updateCartQuantity = (req, res) => {
    return Cart.findOne({ userId: req.user.id })
    .then(cart => {
        if(!cart) {
            return res.status(404).send({ error: "Cart not found" });
        }

        const item = cart.cartItems.find(
            item => item.productId.toString() === req.body.productId
        );

        if(!item) {
            return res.status(404).send({ error: "Product not found in cart" });
        }

        return Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).send({ error: "Product not found" });
            }

            item.quantity = Number(req.body.newQuantity);
            item.subtotal = item.quantity * product.price;

            cart.totalPrice = cart.cartItems.reduce(
                (total, item) => total + item.subtotal, 0
            );

            return cart.save()
            .then(() => res.status(200).send({
                message: "Item quantity updated successfully",
                updatedCart: cart
            }));
        });
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.removeFromCart = (req, res) => {
  return Cart.findOne({userId: req.user.id}).select('-updated_at')
  .then(cart => {

     if(!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

    

    const item = cart.cartItems.find(
      item => item.productId.toString() === req.params.productId)

    if(!item){
      return res.status(404).send({ message : 'Item not found in cart'})
    }

    cart.cartItems = cart.cartItems.filter(
      item => item.productId.toString() !== req.params.productId)


//didnt even know this method existed
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.subtotal, 0
      )


    const cartObj = cart.toObject();
    delete cartObj.updated_at;
    return cart.save()
    .then(() => res.status(200).send(
      { message : "Item removed from cart successfully",
        updatedCart: cartObj
      }));
  })
   .catch(error => errorHandler(error, req, res));
}




module.exports.clearCart = (req, res) => {
  return Cart.findOneAndUpdate(
    {userId : req.user.id},
    { $set: { cartItems: [], totalPrice: 0 } })
  .then(cart => {

    if(!cart){
      return res.status(404).send({message: "Cart not found",
      })
    }

    if(cart.cartItems.length === 0){
      return res.status(400).send({message: "Cart already empty"})
    }

    const cartObj = cart.toObject();
    delete cartObj.updated_at;
    return res.status(200).send(
      {message: "Cart cleared successfully",
      cart : cartObj})


  })
  .catch(error => errorHandler(error, req, res))

}

