const LocalStrategy = require('passport-local').Strategy;

const db = require('../database.js')();

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'pwd'
  },
  (email, password, done) => {
    const sql = 'SELECT * FROM USERS WHERE email=?';
    db.query(sql, [email], (err, results) => {
      const user = results[0];
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
);
