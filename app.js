const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views/listings"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

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

app.listen(8080, () => {
  console.log("listening to port", 8080);
});

app.get("/listings", async (req, res) => {
  let listings = await Listing.find({});
  res.render("index", { listings });
});

app.get("/listings/new", (req, res) => {
  res.render("new");
});

app.post("/listings", async (req, res) => {
  let listing = new Listing(req.body.listing);
  await listing.save().then(() => {
    console.log("added successfully");
  });
  res.redirect("/listings");
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing).then(() => {
    console.log("upadte success");
  });
  res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let Mylisting = await Listing.findOne({ _id: id });
  res.render("edit", { Mylisting });
});

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findOne({ _id: id });
  res.render("detailedView", { listing });
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let result = await Listing.findByIdAndDelete(id).then(() => {
    console.log("deleted success");
  });
  res.redirect("/listings");
});
