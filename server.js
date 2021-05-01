const express = require("express");
const app = express();
const helmet = require("helmet");
app.use(helmet());

const PORT = 3000;

// Main Route
app.get("/", (req, res, next) => {
    res.sendFile(__dirname + "/views" + "/main.html", function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: main.html");
        }
    });
});

// Sign-up Route
app.get("/sign-up", (req, res, next) => {
    res.sendFile(__dirname + "/views" + "/sign-up.html", function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-up.html");
        }
    });
});

app.post("/sign-up_process", (req, res) => {
    // Create DB table
    res.redirect("/main");
});

// Sign-in Route
app.get("/sign-in", (req, res, next) => {
    res.sendFile(__dirname + "/views" + "/sign-in.html", function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: sign-in.html")
        }
    });
});

app.post("/sign-in_process", (req, res) => {
    // Create DB table
    res.redirect("/main");
});

// Mypage Route
app.get("/mypage", (req, res, next) => {
    res.sendFile(__dirname + "/views" + "/mypage.html", function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: mypage.html");
        }
    });
});

// Create Route
app.get("/create", (req, res, next) => {
    res.sendFile(__dirname + "/views" + "/create.html", function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent: create.html");
        }
    });
});

app.post("/create_process", (req, res) => {
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
