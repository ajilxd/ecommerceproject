const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const cartSchema = new mongoose.Schema({
  productId: {
    type: Objectid,
    ref: "products",
  },
  userId: {
    type: Objectid,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
  },
  totals: {
    type: Number,
  },
  productname: {
    type: String,
    required: true,
  },
  isOrder: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
});

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;
