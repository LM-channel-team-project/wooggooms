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
    // 이메일주소, 패스워드, 닉네임 유효성 검사 기능 필요
    if(pwd !== pwd2) {
        // 비밀번호가 일치하지 않는 경우, 회원가입 불가 기능 추가 필요
        console.log('비밀번호가 일치하지 않습니다');
    } else {
        // MySQL wooggoooms-user에 회원정보 저장
        db.query(`INSERT INTO user (id, email, password, nickname) VALUES (?, ?, ?, ?)`,
            [id, email, pwd, nickname],
            function(err, result, fields) {
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

// Sign-in_process Route
router.post("/sign-in_process", function(req, res) {
    const post = req.body;
    const email = post.email;
    const pwd = post.pwd;
    // 입력한 email과 일치하는 회원정보를 DB에서 찾는 query
    db.query(`SELECT * FROM user WHERE email=?`,
        [email],
        function(err, results, fields) {
            if(err) {
                console.log(err);
            }
            if(!results[0]) {
                // 입력한 email과 일치하는 값이 DB에 없는 경우
                console.log('일치하는 이메일이 없습니다');
            } else {
                if(pwd === results[0].password) {
                    // email & password가 일치하는 경우
                    console.log('로그인에 성공했습니다');
                    // 세션에 Memeber 여부 & 고유 id 값  추가
                    req.session.isMember = true;
                    req.session.user_id = results[0].id;
                    req.session.save(function() {
                        return res.redirect('/');
                    })
                } else {
                    // password가 일치하지 않는 경우
                    console.log('비밀번호가 일치하지 않습니다');
                }
            }
        }
    );
});

// Sign-out Route
router.get("/sign-out", function(req, res) {
    if(!req.session.isMember) {
        res.send('로그인이 되어있지 않습니다.');
    } else {
        req.session.destroy(function() {
            res.redirect('/');
            console.log('로그아웃 처리되었습니다');
        });
    }
})

module.exports = router;