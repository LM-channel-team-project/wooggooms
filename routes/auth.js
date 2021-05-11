const express = require("express");
const router = express.Router();
const path = require("path");
const { nanoid } = require("nanoid");
const views_options = {
  root: path.join(__dirname, "../views"),
};

// mysql database
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "111111",
  database: "wooggooms",
});
db.connect();

// passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// 2. Save user data in session store
passport.serializeUser(function (user, done) {
  console.log("[serializeUser] :", user);
  // user = row[0]
  done(null, user.id);
});

// 3. Check if it's signed in every page
passport.deserializeUser(function (id, done) {
  console.log("[deserializeUser] :", id);
  db.query("SELECT * FROM USERS WHERE id=?", id, function (err, rows) {
    done(null, rows);
  });
});

// 1. Compare user ID/PW input and database
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      const sql = "SELECT * FROM USERS WHERE email=?";
      const params = email;
      db.query(sql, params, function (err, rows) {
        if (err) {
          return done(err);
        }
        if (!rows[0]) {
          return done(null, false, { message: "Incorrect email." });
        }
        if (rows[0].password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, rows[0]);
      });
    }
  )
);

// Sign-in Route
router.get("/sign-in", function (req, res, next) {
  res.sendFile("sign-in.html", views_options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: sign-in.html");
    }
  });
});

router.post(
  "/sign-in_process",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  })
);

// Sign-up Route
router.get("/sign-up", function (req, res, next) {
  res.sendFile("sign-up.html", views_options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log("Sent: sign-up.html");
    }
  });
});

// Sign-up_process Route
router.post("/sign-up_process", function (req, res, next) {
  const id = nanoid();
  const email = req.body.email;
  const password = req.body.password;
  const nickname = req.body.nickname;
  const sql =
    "INSERT INTO USERS (id, email, password, nickname, create_date) VALUES (?, ?, ?, ?, NOW())";
  const params = [id, email, password, nickname];

  db.query(sql, params, function (err) {
    if (err) {
      next(err);
    } else {
      console.log(`[${email}] signed up for a local account.`);
    }
  });
  res.redirect("/auth/sign-in");
});

router.get("/sign-out", function (req, res) {
  req.logout();
  console.log("Signed out.");
  res.redirect("/");
});

module.exports = router;
