// DEPENDENCIES || IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes")
const passport = require("passport");
require("./passport");

// Configurations 

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {

	origin: '*',
	credentials: true,
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

// setups session middleware
app.use(session({
	secret: process.env.GOOGLE_CLIENT_SECRET,
	resave: false,
	saveUninitialize: false
}));

// initialize the passport (starts authentication system)
app.use(passport.initialize());
// creates the passport session
app.use(passport.session());

// ROUTES 

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

if(require.main === module) {

	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	})
}

module.exports = { app, mongoose };