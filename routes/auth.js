const express = require('express');
const router = express.Router();
const path = require('path');
const { nanoid } = require('nanoid');
const config = require('../config/databaseConfig');
const dotenv = require('dotenv').config();
const views_options = {
  root: path.join(__dirname, '../views')
};
// mysql database
const db = config.db;
// passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// 2. Save user data in session store
passport.serializeUser((user, done) => {
  done(null, user.id);
  console.log('serializeUser :', user.id);
});

// 3. Check if it's signed in every page
passport.deserializeUser((id, done) => {
  const sql = 'SELECT * FROM USERS WHERE id=?';
  db.query(sql, [id], (err, results) => {
    const user = results[0];
    done(null, user);
    console.log('deserializeUser :', user);
  });
});

// 1. Compare user ID/PW input and database
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'pwd'
    },
    (email, password, done) => {
      const sql = 'SELECT * FROM USERS WHERE email=?';
      // local 방식으로 로그인시, email을 기준으로 user를 특정함.
      db.query(sql, [email], (err, results) => {
        const user = results[0];
        if (err) {
          return done(err);
        }
        if (!user) { //user가 없는 경우.
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (user.password !== password) { // user는 존재하지만 비밀번호가 다른 경우.
          return done(null, false, { message: 'Incorrect password.' });
        } // 그 외의 경우는 user를 serializeUser로 넘김.
        return done(null, user);
      });
    }
  )
);

// passport.use(GoogleStrategy) 내부에서 google 사용자의 profile이 넘어왔을때,
// 해당 user의 profile.id가 우꿈스 db상의 sns_id와 일치하지 않는 경우 호출되는 함수
// google로부터 넘겨받은 profile의 내용을 기반으로 회원가입을 진행시킨 후 serializeUser()로 넘김.
function signUpGoogle(profile) {
  const id = nanoid();
  const email = profile.emails[0]; // 적용여부 확인 필요, 테스트 위해 입력.
  const nickname = profile.displayName; // 구글 연동 회원가입시 따로 nickname 입력을 받는 방법?/ 닉네임 수정으로 바로 넘어가기?
  const sns_id = profile.id;
  const sns_type = profile.provider; // 'google' , 타 플랫폼의 경우 다를 수 있음.
  const sql =
    'INSERT INTO USERS (id, email, password, nickname, sns_id, sns_type, create_date) VALUES (?, ?, ?, ?, ?, ?, NOW())';
  const params = [id, email, "password", nickname, sns_id, sns_type]; // 임의의 비밀번호 저장 가능여부 확인을 위해 'password'입력.
  db.query(sql, params, function (err) {
    if (err) {
      next(err);
    } else {
      console.log(`[${email}] [${nickname}] [${sns_type}] signed up for a google account.`);
      // 적용시 console.log()가 동작하지 않음 -> next(err)이 적용된건지 확인 필요.
    }
  });
  const isUserSQL = 'SELECT * FROM USERS WHERE sns_id=?'; // sns_id를 통해 db내에 존재하는 특정 회원을 지정.
  db.query(isUserSQL,profile.id,(err,results) => {
    const user = results[0];
  });
  // 해당 경우는 바로 위에서 회원가입을 했기 때문에 가독성을 위해 if(err)과 if(!user)를 생략하였으나,
  // 혹시 모를 오류에 대비하여 해당 항목 추가할 것.
  return user; // 해당 user를 return.
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.G_CLI_ID, // .env 파일 내에 지정되어있음. 
      // 검색결과 .json파일의 경우 config 사용이 더 효율적이라고 하는데, 혼용/dotenv/config 중에 결정해야할듯
      clientSecret: process.env.G_CLI_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, done) {
      const isUserSQL = 'SELECT * FROM USERS WHERE sns_id=?';
      // sns_id를 통해 특정 User 지정, 없다면 signUpGoogle() 호출하여 회원가입후 로그인, 이미 존재한다면 바로 로그인.
      db.query(isUserSQL,profile.id,(err,results) => {
        if (err) {
          return done(err);
        }
        if (!results[0]) {
          const newUser = signUpGoogle(profile) // signUpGoogle()함수의 결과로 return된 user를 newUser 변수로 저장.
          return done(null, newUser);
        }
        const user = results[0];
        return done(null, user);
      });
    }
  )
);

router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/sign-in' }),
  function(req, res) {
    res.redirect('/');
  }
);

// Sign-in Route
router.get('/sign-in', function (req, res, next) {
  res.sendFile('sign-in.html', views_options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent: sign-in.html');
    }
  });
});

router.post(
  '/sign-in_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/sign-in'
  })
);

// Sign-up Route
router.get('/sign-up', function (req, res, next) {
  res.sendFile('sign-up.html', views_options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent: sign-up.html');
    }
  });
});

// Sign-up_process Route
router.post('/sign-up_process', function (req, res, next) {
  const id = nanoid();
  const email = req.body.email;
  const password = req.body.password;
  const nickname = req.body.nickname;
  const sql =
    'INSERT INTO USERS (id, email, password, nickname, create_date) VALUES (?, ?, ?, ?, NOW())';
  const params = [id, email, password, nickname];

  db.query(sql, params, function (err) {
      if (err) {
        next(err);
      } else {
        console.log(`[${email}] signed up for a local account.`);
      }
    });
    res.redirect('/auth/sign-in');
  });

router.get('/sign-out', function (req, res) {
  req.logout();
  console.log('Signed out.');
  res.redirect('/');
});



module.exports = router;
