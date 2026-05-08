const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema");
const { isLoggedIn } = require("../middleware");
const { validateReview } = require("../middleware");
const reviewController = require("../controller/reviews");

//listings/:id/reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview),
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  wrapAsync(reviewController.deleteReview),
);

module.exports = router;
