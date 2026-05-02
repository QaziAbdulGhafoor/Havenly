const mongoose = require("mongoose");
const Listing = require("../models/listing");
const sampleListings = require("./data");

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
  let del = await Listing.deleteMany({});
  sampleListings.data = sampleListings.data.map((obj) => ({
    ...obj,
    owner: "69f497bbc44b577734b1c7e2",
  }));
  let res = await Listing.insertMany(sampleListings.data);
  console.log("all added");
};

addListings();
