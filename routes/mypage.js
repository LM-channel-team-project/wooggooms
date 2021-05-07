const express = require("express");
const router = express.Router();
const path = require("path");
const views_options = {
  root: path.join(__dirname, "../views"),
};

router.get("/", function (req, res, next) {
  res.sendFile("mypage.html", views_options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: mypage.html");
    }
  });
});

module.exports = router;
