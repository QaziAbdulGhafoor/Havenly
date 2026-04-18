const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const { listingSchema } = require("./schema");

const listings = require("./routes/listings");
const review = require("./routes/review");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views/listings"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/listings", listings);
app.use("/listings/:id/reviews", review);

app.engine("ejs", ejsMate);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Havenly");
    console.log("MongoDB Connected successfully");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// reviews

app.use((err, req, res, next) => {
  let { status = 500, message } = err;
  res.status(status).render("error", { err });
});
app.listen(8080, () => {
  console.log("listening to port", 8080);
});
