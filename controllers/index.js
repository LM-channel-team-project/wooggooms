const path = require('path');
const views_options = {
  root: path.join(__dirname, '../views')
};

module.exports = function (req, res, next) {
  if (!req.user) {
    res.sendFile('main.html', views_options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent: main.html');
      }
    });
  }
  if (req.user) {
    // 회원용 메인페이지
    res.sendFile('main.html', views_options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent: main.html');
      }
    });
  }
};