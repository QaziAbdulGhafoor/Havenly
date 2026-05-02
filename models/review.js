const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const User = require("./user");

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
