const mongoose = require("mongoose");
const Listing = require("../models/listing");
const allListings = require("./data");

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

let addListings = async () => {
  let res = await Listing.insertMany(allListings);
  console.log(res);
};

addListings();
