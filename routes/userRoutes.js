const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const { verify, validateEmail, verifyAdmin } = require("../auth");



// POST /users/register
router.post("/register", validateEmail, userController.registerUser);

// POST /users/login
router.post("/login", userController.loginUser);

// PATCH /users/update-password
router.patch("/update-password", verify, userController.updatePassword);

// GET /users/details

// POST /users/details

router.get("/details", verify, userController.getProfile);

router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setAsAdmin)

module.exports = router;