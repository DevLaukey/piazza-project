const express = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/create",
  authMiddleware.authenticateUser,
  postController.createPost
);
// Other post-related routes...

module.exports = router;
