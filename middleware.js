const Listing = require("./models/listing");

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

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.user._id)) {
    req.flash("error", "you don't have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
