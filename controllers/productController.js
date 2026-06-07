const Product = require('../models/Product');
const mongoose = require("mongoose");
const { errorHandler } = require("../auth");


module.exports.createProduct = (req, res) => {
    const validCategories = ['clothing', 'electronics', 'accessories', 'footwear', 'home', 'sports', 'toys & games'];

    if (!req.body.name || !req.body.category || !req.body.price) {
        return res.status(400).send({ error: "All fields are required" });
    }
    if (!validCategories.includes(req.body.category)) {
        return res.status(400).send({ error: "Invalid category" });
    }

    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        image_url: req.body.image_url || undefined,
        stock: req.body.stock || undefined
        });

    return newProduct.save()
        .then(result => {
            const { updated_at, __v, ...product } = result.toObject();
            res.status(201).send({ result: product });
        })
        .catch(error => res.status(500).send({ error: error.message }));
};


module.exports.getAllProducts = (req, res) => {
    return Product.find({})
    .then(result => {
        if(result.length > 0){
            return res.status(200).send(result);
        } else {
            return res.status(404).send({ message: "No products found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getActiveProducts = (req, res) => {
    return Product.find({ isActive: true })
    .then(result => {
        if(result.length > 0){
            return res.status(200).send(result);
        } else {
            return res.status(404).send({ message: "No products found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getProduct = (req, res) => {
    return Product.findById(req.params.productId)
    .then(product => {
        if(product) {
            return res.status(200).send(product);
        } else {
            return res.status(404).send({ error: "Product not found" });
        }
    })
    .catch(err => res.status(500).send({ error: err.message }));
};


module.exports.updateProduct = (req, res) => {
  let updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image_url: req.body.image_url,
    stock: req.body.stock,
    isActive: req.body.isActive,  
    is_featured: req.body.is_featured
  }
  return Product.findByIdAndUpdate(req.params.productId, updatedProduct, { new: true, runValidators: true })
    .then(product => {
      if (product) {
        res.status(200).send({ success: true, message: 'Product updated successfully' })
      } else {
        res.status(404).send({ error: 'Product not found' })
      }
    })
    .catch(error => errorHandler(error, req, res))
}


module.exports.archiveProduct = (req, res) => {
    return Product.findById(req.params.productId)
    .then(product => {
        if(!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        if(product.isActive === false) {
            return res.status(200).send({ 
                message: "Product already archived",
                archiveProduct: product
            });
        }
        product.isActive = false;
        return product.save()
        .then(() => res.status(200).send({
            success: true,
            message: "Product archived successfully"
        }));
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.activateProduct = (req, res) => {
    return Product.findById(req.params.productId)
    .then(product => {
        if(!product) {
            return res.status(404).send({ error: "Product not found" });
        }
        if(product.isActive === true) {
            return res.status(200).send({ 
                message: "Product already activated",
                activatedProduct: product
            });
        }
        product.isActive = true;
        return product.save()
        .then(() => res.status(200).send({
            success: true,
            message: "Product activated successfully"
        }));
    })
    .catch(error => errorHandler(error, req, res));
};

// Search by product name
exports.searchByName = async (req, res, next) => {
  
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }
    
    const products = await Product.find({
      name: { $regex: name, $options: 'i' },
    });

    if (!products.length) {
      return res.status(404).json({ message: `No products found matching "${name}"` });
    }
      res.json({ products })
    .catch(error => errorHandler(error, req, res));
  
};

// Search by product price
exports.searchByPrice = async (req, res, next) => {
  
    const { minPrice, maxPrice } = req.body;

    if (minPrice === undefined || maxPrice === undefined) {
      return res.status(400).json({ message: 'minPrice and maxPrice are required' });
    }

    if (Number(minPrice) > Number(maxPrice)) {
      return res.status(400).json({ message: 'minPrice cannot be greater than maxPrice' });
    }

    const products = await Product.find({
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
      isActive: true,
    });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found in this price range' });
    }

    res.json({ products })
  .catch(error => errorHandler(error, req, res));
};

// DELETE /products/:productId/delete  — admin only
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId)  // ← was req.params.id
    if (!product) return res.status(404).json({ message: 'Product not found.' })
    res.json({ message: 'Product deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}