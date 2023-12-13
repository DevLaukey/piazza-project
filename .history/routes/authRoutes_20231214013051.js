const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", (req, res) =>{
res.send("Welcome")});


module.exports = router;
