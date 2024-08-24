const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Update User Route
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updatedData = {};

    if (username) updatedData.username = username;
    if (email) updatedData.email = email;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!user) return res.status(404).send("User not found");

    // Destructure user document to exclude password
    const { password: userPassword, ...others } = user.toObject();
    res.status(200).json(others);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// Route only accessible by admin users
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//GET ALL USER
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET USER
router.get("/find/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
