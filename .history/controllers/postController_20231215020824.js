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
// Action 3: Registered users browse messages per topic
const browseMessagesByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const posts = await Post.find({ topic }).sort({ timestamp: -1 });

    // Populate likes, dislikes, and comments for each post
    const populatedPosts = posts.map(post => {
      return {
        postId: post.postId,
        title: post.title,
        topic: post.topic,
        timestamp: post.timestamp,
        body: post.body,
        expirationTime: post.expirationTime,
        status: post.status,
        owner: post.owner,
        likes: post.likes,
        dislikes: post.dislikes,
        comments: post.comments,  // Assuming comments are directly embedded in the Post model
        interactions: post.interactions,
      };
    });

    res.json(populatedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Action 4: Registered users perform basic operations (like, dislike, comment)
const interactWithPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { user, interactionType, interactionValue, timeLeft, otherInfo } =
      req.body;

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the post has expired
    if (post.expirationTime && new Date(post.expirationTime) < new Date()) {
      return res
        .status(400)
        .json({
          error: "Post has expired and no further interactions are allowed.",
        });
    }

    if (post.status === "Expired") {
      return res
        .status(400)
        .json({
          error: "Post has expired and no further interactions are allowed.",
        });
    }

    // Check if the user is the owner of the post
    if (post.owner === user) {
      return res
        .status(400)
        .json({ error: "Post owner cannot interact with their own messages." });
    }

    // Perform the interaction (like, dislike, or comment)
    switch (interactionType) {
      case "like":
        post.likes += 1;
        break;
      case "dislike":
        post.dislikes += 1;
        break;
      case "comment":
        post.comments.push({
          user,
          content: interactionValue,
          timeLeft,
          otherInfo,
        });
        break;
      default:
        return res.status(400).json({ error: "Invalid interaction type" });
    }

    // Add interaction data to the interactions array
    post.interactions.push({
      user,
      value: interactionType,
      timeLeft,
      otherInfo,
    });

    // Save the updated post to the database
    post = await post.save();

    res.json({ success: true, post });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Action 5: Authorised users browse for the most active post per topic
const mostActivePostPerTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    await Post.findOne({ topic })
      .sort({ likes: -1, dislikes: 1 })
      .then((mostActivePost) => {
        res.json(mostActivePost);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Action 6: Authorised users browse the history data of expired posts per topic
const expiredPostsHistoryPerTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const expiredPosts = await Post.find({ topic, status: "Expired" }).sort({
      expirationTime: -1,
    });
    res.json(expiredPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createPost,
  browseMessagesByTopic,
  interactWithPost,
  mostActivePostPerTopic,
  expiredPostsHistoryPerTopic,
};
