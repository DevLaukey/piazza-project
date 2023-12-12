// Define MongoDB Schema
const postSchema = new mongoose.Schema({
  title: String,
  topic: String,
  timestamp: Date,
  body: String,
  expirationTime: Date,
  status: { type: String, enum: ["Live", "Expired"] },
  owner: String,
  likes: Number,
  dislikes: Number,
  comments: [String],
});
