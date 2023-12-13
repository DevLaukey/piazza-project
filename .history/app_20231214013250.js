const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
// const postRoutes = require("./routes/postRoutes");
const dotenv = require("dotenv").config();


const PORT = 3000;

const app = express()
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/piazza", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

app.get("/", (req, res) => { 
  res.send("Hello World!");
});
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});