module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "user must be logged in to create listing");
    req.session.redirectUrl = req.originalUrl;
    return res.redirect("/login");
  } else {
    next();
  }
};

module.exports.redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
