const express = require('express');
const router = express.Router();
const path = require("path");
const { nanoid } = require('nanoid');
const mysql = require('mysql');
const views_options = {
    root : path.join(__dirname, "../views")
}
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gnltk341',
    database: 'wooggooms'
});
db.connect();

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

// Sign-up_process Route
// POST request 암호화 필요
router.post("/sign-up_process", function(req, res) {
    console.log(req.body);
    const post = req.body;
    const id = nanoid();
    const email = post.email;
    const pwd = post.pwd;
    const pwd2 = post.pwd2;
    const nickname = post.nickname;
    if(pwd !== pwd2) {
        // 비밀번호가 일치하지 않는 경우, 회원가입 불가 기능 추가 필요
        console.log('비밀번호가 일치하지 않습니다');
    } else {
        // 입력 정보 유효성 검사 필요
        // MySQL wooggoooms-user에 회원정보 저장
        db.query(`INSERT INTO user (id, email, password, nickname) VALUES (?, ?, ?, ?)`,
            [id, email, pwd, nickname],
            function(err) {
                if (err) {
                    console.log(err);
                }
                console.log('New User Signed Up!');
            }
        );
        // '회원가입이 완료되었습니다' 팝업. 확인 누르면 로그인 페이지로 리다이렉트
        res.redirect("/auth/sign-in");
    }
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
