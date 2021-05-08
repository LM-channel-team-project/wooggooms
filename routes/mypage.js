const express = require('express');
const router = express.Router();
const path = require("path");
const views_options = {
    root : path.join(__dirname, "../views")
}

// Mypage Route
router.get("/", function(req, res, next) {
    if(!req.session.isMember) {
        res.send('로그인부터 하고 오세요!');
    } else {
        res.sendFile("mypage.html", views_options, function(err) {
            if(err) {
                next(err);
            } else {
                console.log("Sent: mypage.html");
            }
        });
    }
});
module.exports = router;