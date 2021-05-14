/* eslint-disable no-console */
/* eslint-disable global-require */
module.exports = function (app, router, passport, db) {
  const indexRouter = require('../routes/index');
  const authRouter = require('../routes/auth')(router, passport, db);
  const mypageRouter = require('../routes/mypage');
  const createRouter = require('../routes/create');

  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/mypage', mypageRouter);
  app.use('/create', createRouter);

  // 404 responses handler
  app.use((req, res) => {
    res.status(404).send("Sorry can't find that!");
  });

  // server error handler
  app.use((err, req, res) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
};
