/* eslint-disable no-console */
const db = require('./database.js')();
const local = require('./passport/local');
const google = require('./passport/google');

module.exports = function (passport) {
  // use these strategies
  passport.use(local);
  passport.use(google);

  // 1. Save user data in session store
  passport.serializeUser((user, done) => {
    done(null, user.id);
    console.log('serializeUser :', user.id);
  });

  // 2. Check if it's signed in every page
  passport.deserializeUser((id, done) => {
    const sql = 'SELECT * FROM USERS WHERE id=?';
    db.query(sql, [id], (err, results) => {
      const user = results[0];
      if (!user) {
        return done(err, false);
      }
      done(null, user);
      console.log('deserializeUser :', user);
    });
  });
};
