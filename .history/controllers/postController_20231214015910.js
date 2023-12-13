const Post = require("../models/postModel");

// Action 2: Create a new post
const createPost = async (req, res) => {
  try {
    const { title, topic, body, expirationTime, owner } = req.body;

    // Validate required fields
    if (!title || !topic || !body || !expirationTime || !owner) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new post
    const newPost = new Post({
      title,
      topic,
      body,
      expirationTime,
      owner,
    });

    // Save the new post to the database
    await newPost.save();

    res.json({ success: true, post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Action 3: Registered users browse messages per topic
const browseMessagesByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const posts = await Post.find({ topic }).sort({ timestamp: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Action 4: Registered users perform basic operations (like, dislike, comment)
const interactWithPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { user, interactionValue, timeLeft, otherInfo } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Perform the interaction (like, dislike, or comment)
    // Update the post and save it
    // You might want to handle different interactions separately
    // For simplicity, I'll assume "comment" in this example
    post.comments.push({ user, content: interactionValue, timeLeft, otherInfo });
    await post.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Action 5: Authorised users browse for the most active post per topic
const mostActivePostPerTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const mostActivePost = await Post.findOne({ topic }).sort({ likes: -1, dislikes: 1 });
    res.json(mostActivePost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Action 6: Authorised users browse the history data of expired posts per topic
const expiredPostsHistoryPerTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const expiredPosts = await Post.find({ topic, status: 'Expired' }).sort({ expirationTime: -1 });
    res.json(expiredPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createPost,
  browseMessagesByTopic,
  interactWithPost,
  mostActivePostPerTopic,
  expiredPostsHistoryPerTopic,
};