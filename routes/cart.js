const Cart = require("../models/Cart");
const {
  authMiddleware,
  adminMiddleware,
  authorizeUser,
} = require("../middleware/authMiddleware");

const router = require("express").Router();

//CREATE

router.post("/", authMiddleware, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", authMiddleware, authorizeUser, async (req, res) => {
  try {
    console.log("Request Params:", req.params); // Log the request params
    console.log("Request Body:", req.body); // Log the request body
    console.log("authrize", req.user);
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", authMiddleware, authorizeUser, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART
router.get("/find/:userId", authMiddleware, authorizeUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
