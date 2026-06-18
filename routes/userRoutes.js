const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const { verify, validateEmail, verifyAdmin } = require("../auth");
const passport = require("passport");


// POST /users/register
router.post("/register", validateEmail, userController.registerUser);

// POST /users/login
router.post("/login", userController.loginUser);

// PATCH /users/update-password
router.patch("/update-password", verify, userController.updatePassword);

// PUT /users/update-profile
router.put('/update-profile', verify, userController.updateProfile);

// GET /users/details
router.get("/details", verify, userController.getProfile);

// PATCH /users/:id/set-as-admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setAsAdmin)

router.get("/google",
	passport.authenticate("google", {
		scope: ["email", "profile"],
		prompt: "select_account"
	}
));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  (req, res) => {
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  }
);

/*router.get("/failed", (req,res)=>{
	res.send("Failed")
})

router.get("/success", (req, res) => {
  if (!req.user) return res.redirect("/users/failed");
  const token = signToken(req.user._id);
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?access=${token}`);
});*/

module.exports = router;