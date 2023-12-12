const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  topic: { type: String, enum: ["Politics", "Health", "Sport", "Tech"] },
  timestamp: { type: Date, default: Date.now },
  body: String,
  expirationTime: Date,
  status: { type: String, enum: ["Live", "Expired"], default: "Live" },
  owner: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [String],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
