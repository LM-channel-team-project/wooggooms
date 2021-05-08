const express = require('express');
const router = express.Router();
const path = require("path");
const views_options = {
    root : path.join(__dirname, "../views")
}

// Sign-up Route
router.get("/sign-up", function(req, res, next) {
    res.sendFile("sign-up.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-up.html");
        }
    });
});

router.post("/sign-up_process", function(req, res) {
    // Create DB table
    res.redirect("/");
});

// Sign-in Route
router.get("/sign-in", function(req, res, next) {
    res.sendFile("sign-in.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-in.html");
        }
    });
});

router.post("/sign-in_process", function(req, res) {
    // Create DB table
    res.redirect("/");
});
module.exports = router;
