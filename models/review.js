const mongoose = require("mongoose");
const { Schema } = require("mongoose");

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
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
