const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.postReview = async (req, res) => {
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
};

module.exports.deleteReview = async (req, res) => {
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
};
