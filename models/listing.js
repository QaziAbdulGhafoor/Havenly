const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Review = require("./review");
const User = require("./user");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "reviews",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
    },

    coordinates: {
      type: [Number],
    },
  },
  category: {
    type: String,
    required: true,
    enum: ["house", "mountain", "apartment", "river side", "luxury"],
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

let Listing = new mongoose.model("listings", listingSchema);
module.exports = Listing;
