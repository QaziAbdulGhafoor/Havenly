const mongoose = require("mongoose");
const { Schema } = require("mongoose");

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//     min: 15,
//     max: 50,
//   },
//   description: {
//     type: String,
//     required: true,
//     min: 50,
//     max: 200,
//   },
//   image: {
//     url: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   location: {
//     type: String,
//     required: true,
//   },
//   country: {
//     type: String,
//     required: true,
//   },
// });

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1603477849227-705c424d1d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJvcGljYWwlMjBiZWFjaHxlbnwwfHwwfHx8MA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1603477849227-705c424d1d80?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJvcGljYWwlMjBiZWFjaHxlbnwwfHwwfHx8MA%3D%3D"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

let Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;
