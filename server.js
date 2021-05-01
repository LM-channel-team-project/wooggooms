const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");
app.use(helmet());

const PORT = 3000;

// 21.05.01 loopbackseal 수정내용:
// 추후에 options 수정이 필요할 수 있기 때문에 options를 활용하여 sendFile 실행.
//      -> view_options로 통일하여 선언. css의 경우 styles_option?
//      -> 각 app.get() 익명함수 내부에 options를 선언한 것보다 느린것 같음. 의논 필요
// 운영체제 별 차이로 인해 오류 발생 가능성 존재, path.join 활용.
// 화살표 함수 -> 익명 함수로 수정.
// ?: sign-up_process && sign-in_process 의 redirect -> "/main" or "/" 

var views_options = {
    root : path.join(__dirname, "views")
}
// Main Route
app.get("/", function(req, res, next) {
    var fileName = "main";
    res.sendFile(`${fileName}.html`, views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent:",fileName);
        }
    });
});

// Sign-up Route
app.get("/sign-up", function(req, res, next) {
    var fileName = "sign-up";
    res.sendFile(`${fileName}.html`, views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent:",fileName);
        }
    });
});

app.post("/sign-up_process", function(req, res) {
    // Create DB table
    res.redirect("/main");
});

// Sign-in Route
app.get("/sign-in", function(req, res, next) {
    var fileName = "sign-in";
    res.sendFile(`${fileName}.html`, views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent:",fileName);
        }
    });
});

app.post("/sign-in_process", function(req, res) {
    // Create DB table
    res.redirect("/main");
});

// Mypage Route
app.get("/mypage", function(req, res, next) {
    var fileName = "mypage";
    res.sendFile(`${fileName}.html`, views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent:",fileName);
        }
    });
});

// Create Route
app.get("/create", function(req, res, next) {
    var fileName = "create";
    res.sendFile(`${fileName}.html`, views_options, function(err) {
        if(err) {
            next(err);
        } else {
            console.log("Sent:",fileName);
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