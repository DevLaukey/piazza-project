const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const interactionSchema = new mongoose.Schema({
  user: String,
  value: { type: String, enum: ["like", "dislike", "comment"] },
  timeLeft: String,
  otherInfo: String,
});

const postSchema = new mongoose.Schema({
  postId: { type: Number, unique: true },
  title: String,
  topic: { type: String, enum: ["Politics", "Health", "Sport", "Tech"] },
  timestamp: { type: Date, default: Date.now },
  body: String,
  expirationTime: Date,
  status: { type: String, enum: ["Live", "Expired"], default: "Live" },
  owner: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [
    {
      user: String,
      content: String,
      timeLeft: String,
      otherInfo: String,
    },
  ],
  interactions: [interactionSchema], // Array to store interactions
});

postSchema.pre("save", async function (next) {
  const doc = this;
  if (!doc.postId) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "postId" },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );
      doc.postId = counter.sequence_value;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
