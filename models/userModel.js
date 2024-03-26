const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    mobilenumber: {
      type: String,
    },
    dateofbirth: {
      type: Number,
    },
    password: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
    },
    isVerified: {
      type: Boolean,
    },
    totalcart: {
      type: Number,
    },
    boughtProducts:{
      type:Array
    }
  },
  {
    timestamps: true,
  }
);

const userModal = mongoose.model("user", userSchema);
module.exports = userModal;
