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
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/user");
const upload = multer({ storage });

router
  .route("/:id/favourites")
  .post(isLoggedIn, listingController.addnewfavourite)
  .get(isLoggedIn, listingController.showfavourites)
  .delete(isLoggedIn, listingController.removeFavourite);

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
    upload.single("listing[image]"),
    validateListing,

    wrapAsync(listingController.postUpdate),
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
