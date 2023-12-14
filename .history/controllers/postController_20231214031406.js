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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Action 4: Registered users perform basic operations (like, dislike, comment)
const likePost = async (postId, user, timeLeft, otherInfo) => {

  console.log(postId, user, timeLeft, otherInfo);
  try {
    const post = await Post.findById(postId);
    console.log("post",post);
    if (!post) {
      throw new Error("Post not found");
    }

    // Add interaction data
    post.likes += 1;
    post.interactions.push({
      user,
      type: "like",
      timeLeft,
      otherInfo,
    });

    await post.save();
    return post;
  } catch (error) {
    console.log("Error liking post", error.message);
  }
};

const dislikePost = async (postId, user, timeLeft, otherInfo) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Add interaction data
    post.dislikes += 1;
    post.interactions.push({
      user,
      type: "dislike",
      timeLeft,
      otherInfo,
    });

    await post.save();
    return post;
  } catch (error) {
    throw new Error("Error disliking post");
  }
};

const commentOnPost = async (
  postId,
  user,
  interactionValue,
  timeLeft,
  otherInfo
) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Add interaction data
    post.comments.push({
      user,
      content: interactionValue,
      timeLeft,
      otherInfo,
    });

    await post.save();
    return post;
  } catch (error) {
    throw new Error("Error commenting on post");
  }
};

const interactWithPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { user, interactionType, interactionValue, timeLeft, otherInfo } =
      req.body;

    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
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
        port.comments = interactionValue;
        post.comments.push(interactionValue);
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
