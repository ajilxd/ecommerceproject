const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;

const addressSchema = new mongoose.Schema({
  userId: {
    type: Objectid,
    ref: "users",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  addressline: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  mobileno: {
    type: String,
    required: true,
  },
});

const addressModel = mongoose.model("address", addressSchema);
module.exports = addressModel;
