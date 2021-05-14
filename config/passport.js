const dbConfig = require('./database');
const { db } = dbConfig;
const local = require('./passport/local');
const google = require('./passport/google');
const facebook = require('./passport/facebook');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
    console.log('serialized: ', user);
  });

  passport.deserializeUser(function (id, done) {
    const sql = 'SELECT * FROM user WHERE id=?';
    db.query(sql, [id], function (err, results) {
      const user = results[0];
      if (!user) {
        return done(err, false);
      }
      return done(null, user);
    });
    console.log('deserialized');
  });

  passport.use(local);
  passport.use(facebook);
  passport.use(google);

};
