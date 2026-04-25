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
    res.render("index", { listings });
  }),
);

//new route
router.get("/new", (req, res) => {
  res.render("new");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    let listing = new Listing(req.body.listing);
    await listing.save();
    req.flash("success", "listing added Successfully");
    res.redirect("/");
  }),
);

//update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing).then(() => {
      console.log("update success");
    });
    res.redirect("/listings");
  }),
);

//update route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let Mylisting = await Listing.findOne({ _id: id });
    res.render("edit", { Mylisting });
  }),
);

//detailed view
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Review.find({});
    let listing = await Listing.findById(id).populate("reviews");
    res.render("detailedView", { listing });
  }),
);

//delete listing

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let result = await Listing.findByIdAndDelete(id).then(() => {
      console.log("deleted success");
    });
    res.redirect(`/listings`);
  }),
);

module.exports = router;
