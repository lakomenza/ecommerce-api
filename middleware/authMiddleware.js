const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).send("User not found");
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};
const authorizeUser = (req, res, next) => {
  const userId = req.body.userId; // Extract userId from request body
  if (req.user._id.toString() !== userId) {
    return res.status(403).send("Unauthorized access");
  }
  next();
};
// Middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied. Admins only.");
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  authorizeUser,
};
