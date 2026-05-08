const User = require("../models/user");

module.exports.signup = async (req, res) => {
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
};

module.exports.renderSignup = (req, res) => {
  res.render("../views/users/signup");
};

module.exports.renderLogin = (req, res) => {
  res.render("./users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  if (res.locals.redirectUrl) {
    res.redirect(res.locals.redirectUrl);
  } else {
    res.redirect("/listings");
  }
};

module.exports.logout = (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logout successful");
    res.redirect("/listings");
  });
};
