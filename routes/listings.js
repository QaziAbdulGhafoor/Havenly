const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const flash = require("connect-flash");
const { listingSchema } = require("../schema");

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
    let listings = await Listing.find({}).populate("reviews");
    res.render("listings/index", { listings });
  }),
);

//new route
router.get("/new", (req, res) => {
  res.render("listings/new");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success", "listing Added Successfully");
    res.redirect("/listings");
  }),
);

//update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
  }),
);

//update route
router.get(
  "/:id/edit",
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
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing Not Found");
      res.redirect("/listings");
    } else {
      res.render("listings/detailedView", { listing });
    }
  }),
);

//delete listing

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let result = await Listing.findByIdAndDelete(id);
    req.flash("success", `Listing ${listing.title} Deleted Successfully`);
    res.redirect(`/listings`);
  }),
);

module.exports = router;
