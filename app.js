const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const User = require("./models/user.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const session = require("express-session");
const flash = require("connect-flash");
const { listingSchema } = require("./schema");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listings");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(flash());
let sessionVariables = {
  secret: "AbdulHadi",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionVariables));

// implementing passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.user = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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

// app.get("/demo", async (req, res) => {
//   let newUser = new User({
//     email: "abc@gmail.com",
//     username: "abdulhanan",
//   });

//   let result = await User.register(newUser, "hellopassword");
//   console.log(result);
//   res.send("done user");
// });

// reviews

app.use((err, req, res, next) => {
  let { status = 500, message } = err;
  res.status(status).render("listings/error.ejs", { err });
});
app.listen(8080, () => {
  console.log("listening to port", 8080);
});
