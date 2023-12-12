const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost/piazza", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

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

const Post = mongoose.model("Post", postSchema);

// JWT Authentication Middleware
const authenticateUser = (req, res, next) => {
  // Implement JWT authentication logic here
  // You may need to check the token in the Authorization header
  // and verify it using the secret key
  // If authentication fails, return a 401 Unauthorized response
  next();
};

// RESTful API Endpoints
app.post("/api/posts", authenticateUser, async (req, res) => {
  // Implement logic for creating a new post
  // Validate and save the post data to MongoDB
});

app.get("/api/posts/:topic", authenticateUser, async (req, res) => {
  // Implement logic for retrieving posts by topic
});

// Add more endpoints for other actions as needed

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
