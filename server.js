const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");
app.use(helmet());

const PORT = 3000;

// 21.05.03 loopbackseal 수정내용:
// fileName 변수 삭제하고 문자열 형태로 전달
// var -> let로 수정.
// sign-up_process && sign-in_process 의 redirect 수정 "/main" -> "/" 

let views_options = {
    root : path.join(__dirname, "views")
}
// Main Route
app.get("/", function(req, res, next) {
    res.sendFile("main.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: main.html");
        }
    });
});

// Sign-up Route
app.get("/sign-up", function(req, res, next) {
    res.sendFile("sign-up.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-up.html");
        }
    });
});

app.post("/sign-up_process", function(req, res) {
    // Create DB table
    res.redirect("/main");
});

// Sign-in Route
app.get("/sign-in", function(req, res, next) {
    res.sendFile("sign-in.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-in.html");
        }
    });
});

app.post("/sign-in_process", function(req, res) {
    // Create DB table
    res.redirect("/main");
});

// Mypage Route
app.get("/mypage", function(req, res, next) {
    res.sendFile("mypage.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: mypage.html");
        }
    });
});

// Create Route
app.get("/create", function(req, res, next) {
    res.sendFile("create.html", views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: create.html");
        }
    });
});

app.post("/create_process", function(req, res) {
    // Create DB table
    res.redirect("/mypage");
});


// 404 responses handler
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

// Server error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Start HTTP server listening
app.listen(PORT, function() {
    console.log(`listening on ${PORT}`);
});