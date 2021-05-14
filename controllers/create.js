const path = require('path');
const views_options = {
  root: path.join(__dirname, '../views')
};

module.exports = {
  load: function (req, res, next) {
    if (!req.user) {
      res.redirect('/auth/sign-in');
    } else {
      res.sendFile('create.html', views_options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log('Sent: create.html');
        }
      });
    }
  },
  create: function (req, res) {
    // Create DB table
    res.redirect('/mypage');
  }
};
