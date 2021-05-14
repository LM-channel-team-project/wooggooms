const LocalStrategy = require('passport-local').Strategy;
const dbConfig = require('../database');
const { db } = dbConfig;

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd'
  },
  function (email, password, done) {
    const sql = 'SELECT * FROM user WHERE email=?';
    db.query(sql, [email], function (err, results) {
      const user = results[0];
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect email' });
      }
      if (password !== user.password) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    });
  }
);
