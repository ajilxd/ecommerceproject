const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const wishlistSchema = new mongoose.Schema({
  userId: {
    type: Objectid,
    required: true,
    ref: "users",
  },
  product: {
    type: Array,
    ref: "products",
  },
});

const wishlistModel = mongoose.model("wishlists", wishlistSchema);
module.exports = wishlistModel;
