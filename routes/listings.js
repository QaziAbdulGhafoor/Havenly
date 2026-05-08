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
const { validateListing } = require("../middleware");
const listingController = require("../controller/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.postNew),
  );
// .post(upload.single("listing[image]"), (req, res) => {
//   res.send(req.file);
// });

//new route
router.get("/new", isLoggedIn, listingController.getNew);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .get(wrapAsync(listingController.detailedView))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

//update route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.getUpdate),
);

module.exports = router;
