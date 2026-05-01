module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "user must be logged in to create listing");
    return res.redirect("/login");
  } else {
    next();
  }
};
