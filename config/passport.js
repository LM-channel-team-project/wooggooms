/* eslint-disable no-console */
const db = require('./database');
const local = require('./passport/local');

module.exports = function (passport) {
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
      done(null, user);
      console.log('deserializeUser :', user);
    });
  });

  // use these strategies
  passport.use(local);
};
