const express = require("express");
const router = express.Router();
const path = require("path");
const views_options = {
  root: path.join(__dirname, "../views"),
};

router.get("/", function (req, res, next) {
  res.sendFile("create.html", views_options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: create.html");
    }
  });
});

router.post("/create_process", function (req, res) {
  // Create DB table
  res.redirect("/mypage");
});

module.exports = router;