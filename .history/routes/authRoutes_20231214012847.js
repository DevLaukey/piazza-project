const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", function (req, res) {
  authController.registerUser;
});
router.post("/login", function (req, res) {
  authController.loginUser;
});

module.exports = router;
