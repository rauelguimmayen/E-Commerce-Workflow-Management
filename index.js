// DEPENDENCIES || IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes")
const twoFactorRoutes = require("./routes/twoFactorRoutes");
const { authenticator } = require('otplib');
const QRCode = require('qrcode');



// Configurations 

require('dotenv').config();
const app = express();

app.use(express.json());

app.use(cors({
  origin: '*', 
  credentials: true,
}));

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))


// ROUTES 

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/2fa", twoFactorRoutes);

if(require.main === module) {

	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	})
}

module.exports = { app, mongoose };