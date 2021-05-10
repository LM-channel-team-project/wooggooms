const express = require('express');
const router = express.Router();
const path = require("path");
const views_options = {
    root : path.join(__dirname, "../views")
}
// Main Route
router.get("/", function(req, res, next) {
    console.log('/',req.user);
    res.sendFile("main.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: main.html");
        }
    });
});
module.exports = router;