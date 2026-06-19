// routes/twoFactorRoutes.js
const express = require('express')
const router = express.Router()
const { verify, verifyTemp } = require("../auth");
const twoFactorController = require('../controllers/twoFactorController')

router.post("/init", verify, twoFactorController.init);
router.post("/confirm", verify, twoFactorController.confirm);
router.post("/verify", verifyTemp, twoFactorController.verifyCode);

module.exports = router