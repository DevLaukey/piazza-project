const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", (req, res) =>{
res.send("Welcome")});
router.post("/login", (req, res) =>{
  authController.loginUser;
});

module.exports = router;
