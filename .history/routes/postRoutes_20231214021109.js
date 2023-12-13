const express = require("express");
const postController = require("../controllers/postController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Action 2: Authorised users post a message for a particular topic
router.post('/create', verifyToken, postController.createPost);

// Action 3: Registered users browse messages per topic
router.get('/browse/:topic', verifyToken, postController.browseMessagesByTopic);

// Action 4: Registered users perform basic operations (like, dislike, comment)
router.post('/interact/:postId', verifyToken, postController.interactWithPost);

// Action 5: Authorised users browse for the most active post per topic
router.get('/mostActive/:topic', verifyToken, postController.mostActivePostPerTopic);

// Action 6: Authorised users browse the history data of expired posts per topic
router.get('/expiredHistory/:topic', verifyToken, postController.expiredPostsHistoryPerTopic);

module.exports = router;
