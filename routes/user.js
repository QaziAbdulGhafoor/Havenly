const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { redirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
  res.render("../views/users/signup");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const savedUser = await User.register(newUser, password);
      req.logIn(savedUser, (err) => {
        if (err) {
          return next(err);
        } else {
          req.flash("success", "user registered successfully");
          res.redirect("/listings");
        }
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }),
);

router.get("/login", (req, res) => {
  res.render("./users/login");
});

router.post(
  "/login",
  redirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome Back!");
    if (res.locals.redirectUrl) {
      res.redirect(res.locals.redirectUrl);
    } else {
      res.redirect("/listings");
    }
  },
);

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logout successful");
    res.redirect("/listings");
  });
});

module.exports = router;
