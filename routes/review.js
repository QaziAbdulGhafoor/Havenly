const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema");
const { isLoggedIn } = require("../middleware");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//listings/:id/reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", `Review to ${listing.title} added Successfully`);
    console.log(review);
    res.redirect(`/listings/${id}`);
  }),
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (review.author._id.equals(res.locals.user._id)) {
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", `Review deleted Successfully`);
      res.redirect(`/listings/${id}`);
    } else {
      req.flash("error", "you are not author of review");
      return res.redirect(`/listings/${id}`);
    }
  }),
);

module.exports = router;
