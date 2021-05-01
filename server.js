const express = require("express");
const app = express();
const compression = require("compression");
const helmet = require("helmet");
app.use(compression());
app.use(helmet());

const PORT = 3000;

// Main Route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views" + "/main.html");
});

// Sign-up Route
app.get("/sign-up", (req, res) => {
  res.sendFile(__dirname + "/views" + "/sign-up.html");
});

app.post("/sign-up_process", (req, res) => {
  // Create DB table
  res.redirect("/main");
});

// Sign-in Route
app.get("/sign-in", (req, res) => {
  res.sendFile(__dirname + "/views" + "/sign-in.html");
});

app.post("/sign-in_process", (req, res) => {
  // Create DB table
  res.redirect("/main");
});

// Mypage Route
app.get("/mypage", (req, res) => {
  res.sendFile(__dirname + "/views" + "/mypage.html");
});

// Create Route
app.get("/create", (req, res) => {
  res.sendFile(__dirname + "/views" + "/create.html");
});

app.post("/create_process", (req, res) => {
  // Create DB table
  res.redirect("/mypage");
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 404 responses handler
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

// Start HTTP server listening
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
