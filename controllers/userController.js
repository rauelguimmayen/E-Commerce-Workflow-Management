const User = require('../models/User');
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { createAccessToken, errorHandler } = require("../auth");

// User Registration
module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")){
        return res.status(400).send({ message: "Invalid email format" });
    }
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ message: "Mobile number is invalid" });
    }
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: "Password must be atleast 8 characters long" });
    } else {

        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            // 10 salt rounds for bcrypt
            password : bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
        .then((result) => res.status(201).send({ message: "User registered successfully" }))
        .catch(error => {
            if(error.code === 11000){
                res.status(409).send({ message: 'Duplicate Email Exist' });
            } else {
                res.status(500).send({ error: error.message });
            }
        });
    }
};

// Get Profile
module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id).select('-password -created_at -updated_at')
    .then(user => {
        if(user){
            res.status(200).send({user : user})
        } else{
            res.status(404).send({error : "User not found"})
        }
    })
    .catch(error => res.status(500).send({ error: error.message }));
};

// User Login
// User Login
module.exports.loginUser = (req, res) => {

    if(!req.body.email){
        return res.status(404).send({ message: "No email found" });
    }
    const email = req.body.email.trim();
    if(req.body.email.includes("@")) {

        return User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } })
        .then(result => {

            if(result == null) {
                return res.status(404).send({ message: 'No email found' });
            } else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if(isPasswordCorrect) {
                    return res.status(200).send({
                        success: true,
                        message: "User logged in successfully",
                        access: createAccessToken(result)
                    });
                } else {
                    return res.status(401).send({ message: "Incorrect email or password" });
                }
            }
        })
        .catch(error => res.status(500).send({ error: error.message }));

    } else {
        return res.status(400).send({ message: "Invalid email format" });
    }
};


module.exports.setAsAdmin = (req, res) => {
    return User.findById(req.params.id).select('-created_at -updated_at')
    .then(user => {
        if(!user){
            return res.status(404).send({ error: "User not found" });
        }
        // if(user.isAdmin == true){
        //     return res.status(400).send({ error: "User is already an admin" });
        // }

        return User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true })
        .then(updatedUser => {
            res.status(200).json({ updatedUser: user.toObject() });
        })
    })
    .catch(error => res.status(500).send(
        { error: "Failed in Find",
        details: error}
        ));

}; 

module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // Ensure new password is present
    if (!newPassword) {
      return res.status(400).json({
        error: { message: "New password is required"}
      });
    }

    // Enforce minimum password length
    if (newPassword.length < 8) {
      return res.status(400).json({
        error: { message: "New password must be at least 8 characters long"}
      });
    }

    // Get user id from the Bearer token
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: { message: "User not found"}
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: { message: err.message }
    });
  }

};


