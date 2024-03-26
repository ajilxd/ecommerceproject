const mongoose = require("mongoose");

const Objectid = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    userId: {
      type: Objectid,
      required: true,
      ref: "user",
    },
    productId: {
      type: Objectid,
      required: true,
      ref: "products",
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = new mongoose.model("reviews", reviewSchema);
module.exports = reviewModel;
