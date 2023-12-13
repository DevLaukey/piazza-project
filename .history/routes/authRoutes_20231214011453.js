const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", verifyToken,authController.loginUser);

module.exports = router;
