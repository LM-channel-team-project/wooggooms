const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const db = require('./database.js');

module.exports = function (app, passport) {
  app.use(helmet());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      secret: 'process.env.SESSION_SECRET',
      store: db,
      resave: false,
      saveUninitialized: false
    })
  );

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());
};
