const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const verifyToken = require("./middleware/authMiddleware");
const dotenv = require("dotenv").config();


const PORT = 3000;

const app = express()
app.use(bodyParser.json());

mongoose.connect("mongodb://https://104.154.209.72/piazza", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

app.post("/", verifyToken,(req, res) => { 
  res.send("You are allowed to be here");
});
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://https://104.154.209.72:${PORT}`);
});
