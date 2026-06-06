
const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");
const { verify, verifyAdmin } = require("../auth");






// POST /products/
router.post("/", verify, verifyAdmin, productController.createProduct)

router.get("/all", verify, verifyAdmin, productController.getAllProducts)

router.get("/active", productController.getActiveProducts)

// GET /products/:productId
router.get("/:productId", productController.getProduct);
// PATCH  /products/:productId/update
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// PATCH /products/:productId/archive Admin only
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// PATCH /products/:productId/activate Admin only
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// POST /products/search-by-name
router.post("/search-by-name", productController.searchByName);

// POST /products/search-by-price
router.post("/search-by-price", productController.searchByPrice);

// DELETE /products/:productId/delete
router.delete("/:productId/delete", verify, verifyAdmin, productController.deleteProduct);

module.exports = router;

