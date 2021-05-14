const FacebookStrategy = require('passport-facebook').Strategy;
const dbConfig = require('../database');
const { db } = dbConfig;

module.exports = new FacebookStrategy(
  {
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_CBURL
  },
  function (accessToken, refreshToken, profile, done) {
    const sns_id = profile.id;
    const sns_type = profile.provider;
    const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
    db.query(sql, [sns_id, sns_type], function (err, results) {
      const user = results[0];
      // 처음 방문한 유저라면: 회원가입 시키고 로그인 시키기
      if (!user) {
        const id = nanoid();
        const nickname = profile.displayName;
        const sql =
          'INSERT INTO user (id, sns_id, sns_type, nickname) VALUES (?, ?, ?, ?)';
        db.query(
          sql,
          [id, sns_id, sns_type, nickname],
          function (err, result, field) {
            if (err) {
              console.log(err);
            }
            console.log('페이스북 계정으로 처음 방문하셨네요!');
            const sql = 'SELECT * FROM user WHERE sns_id=? AND sns_type=?';
            db.query(sql, [sns_id, sns_type], function (err, results) {
              if (err) {
                console.log(err);
              }
              console.log('페이스북 계정으로 가입시켰습니다!');
              return done(null, results[0]);
            });
          }
        );
      }
      // 처음 방문한 유저가 아니라면: 바로 로그인 시키기
      if (user) {
        console.log('재방문 하셨네요!');
        return done(null, user);
      }
    });
  }
);
