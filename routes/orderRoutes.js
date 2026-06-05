const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verify, verifyAdmin } = require('../auth');



router.post("/checkout", verify, orderController.createOrder)

router.get("/my-orders", verify, orderController.getUserOrders)

router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

// PUT /orders/:id/status  — admin: update status
router.put("/:id/status", verify, verifyAdmin, orderController.updateStatus);

module.exports = router;











