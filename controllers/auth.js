const { nanoid } = require('nanoid');
const path = require('path');
const dbConfig = require('../config/database');
const { db } = dbConfig;
const views_options = {
  root: path.join(__dirname, '../views')
};

module.exports = {
  load_signup: function (req, res, next) {
    res.sendFile('sign-up.html', views_options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent: sign-up.html');
      }
    });
  },

  load_signin: function (req, res, next) {
    res.sendFile('sign-in.html', views_options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent: sign-in.html');
      }
    });
  },

  process_signup: function (req, res) {
    console.log(req.body);
    const post = req.body;
    const id = nanoid();
    const email = post.email;
    const pwd = post.pwd;
    const pwd2 = post.pwd2;
    const nickname = post.nickname;
    const sql =
      'INSERT INTO user (id, email, password, nickname) VALUES (?, ?, ?, ?)';
    // 이메일주소, 패스워드, 닉네임 유효성 검사 기능 필요
    if (pwd !== pwd2) {
      // 비밀번호가 일치하지 않는 경우, 회원가입 불가 기능 추가 필요
      console.log('비밀번호가 일치하지 않습니다');
    } else {
      // MySQL wooggoooms-user에 회원정보 저장
      db.query(sql, [id, email, pwd, nickname], function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          console.log('New User Signed Up!');
        }
      });
      // '회원가입이 완료되었습니다' 팝업. 확인 누르면 로그인 페이지로 리다이렉트
      res.redirect('/auth/sign-in');
    }
  },

  process_signout: function (req, res) {
    req.session.destroy(function () {
      res.redirect('/');
      console.log('로그아웃 처리되었습니다');
    });
  }
};
