const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/authMiddleware");
const { Router } = require("express");


Router.post("/register", authController.registerUser);
router.post("/login", verifyToken,authController.loginUser);

module.exports = router;
