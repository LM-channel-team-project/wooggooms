/* eslint-disable camelcase */
/* eslint-disable no-console */
require('dotenv').config();
const { nanoid } = require('nanoid');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const db = require('../database.js')();

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_URL
  },
  (accessToken, refreshToken, profile, done) => {
    // 회원 확인
    const sns_type = profile.provider;
    const sns_id = profile.id;
    const sql_select = 'SELECT * FROM USERS WHERE sns_type=? AND sns_id=?';
    db.query(sql_select, [sns_type, sns_id], (err, results) => {
      const user = results[0];
      // 에러
      if (err) {
        return done(err);
      }
      // 회원가입
      if (!user) {
        const id = nanoid();
        const nickname = profile.displayName;
        const sns_profile = profile.photos[0].value;
        const sql_insert =
          'INSERT INTO USERS (id, nickname, sns_type, sns_id, sns_profile, create_date) VALUES (?, ?, ?, ?, ?, NOW())';
        db.query(
          sql_insert,
          [id, nickname, sns_type, sns_id, sns_profile],
          err => {
            if (err) {
              return done(err);
            }
          }
        );
      }
      // 로그인
      db.query(sql_select, [sns_type, sns_id], (err, results) => {
        const user = results[0];
        // 에러
        if (err) {
          return done(err);
        }
        // 로그인
        return done(null, user);
      });
    });
  }
);
