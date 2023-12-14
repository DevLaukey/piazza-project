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
// Action 3: Registered users browse messages per topic
const browseMessagesByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const posts = await Post.find({ topic }).sort({ timestamp: -1 });

    // Populate likes, dislikes, and comments for each post
    const populatedPosts = await Promise.all(
      posts.map(async (post) => {
        const likes = post.likes;
        const dislikes = post.dislikes;
        
        // Populate comments with user, content, timeLeft, and otherInfo
        const populatedComments = await Promise.all(
          post.comments.map(async (commentId) => {
            const comment = await Comment.findById(commentId);
            return {
              user: comment.user,
              content: comment.content,
              timeLeft: comment.timeLeft,
              otherInfo: comment.otherInfo,
            };
          })
        );

        return {
          postId: post.postId,
          title: post.title,
          topic: post.topic,
          timestamp: post.timestamp,
          body: post.body,
          expirationTime: post.expirationTime,
          status: post.status,
          owner: post.owner,
          likes,
          dislikes,
          comments: populatedComments,
          interactions: post.interactions,
        };
      })
    );

    res.json(populatedPosts);
  } catch (error) {
    console.error(error);
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
