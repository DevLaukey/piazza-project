const Post = require("../models/postModel");

const createPost = async (req, res) => {
  try {
    const { title, topic, body, expirationTime } = req.body;

    // Validate required fields
    if (!title || !topic || !body || !expirationTime) {
      return res
        .status(400)
        .json({ message: "Bad Request - Missing required fields" });
    }

    // Assuming the authenticated user information is available in req.user
    const owner = req.user.username;

    // Create a new post
    const newPost = new Post({
      title,
      topic,
      timestamp: new Date(),
      body,
      expirationTime: new Date(expirationTime),
      status: "Live",
      owner,
      likes: 0,
      dislikes: 0,
      comments: [],
    });

    // Save the post to the database
    await newPost.save();

    res.json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Other post-related functions...

module.exports = { createPost };