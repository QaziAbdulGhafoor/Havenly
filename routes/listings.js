const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const flash = require("connect-flash");
const passport = require("passport");
const { listingSchema } = require("../schema");
const { isLoggedIn, isOwner } = require("../middleware");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({}).populate("reviews").populate("owner");
    res.render("listings/index", { listings });
  }),
);

//new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "listing Added Successfully");
    res.redirect("/listings");
  }),
);

//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.user._id)) {
      req.flash("error", "you don't have permission");
      return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
  }),
);

//update route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let Mylisting = await Listing.findOne({ _id: id });
    res.render("listings/edit", { Mylisting });
  }),
);

//detailed view
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Review.find({});
    let listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing Not Found");
      res.redirect("/listings");
    } else {
      res.render("listings/detailedView", { listing });
      console.log(listing);
    }
  }),
);

//delete listing

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let result = await Listing.findByIdAndDelete(id);
    req.flash("success", `Listing ${listing.title} Deleted Successfully`);
    res.redirect(`/listings`);
  }),
);

module.exports = router;
