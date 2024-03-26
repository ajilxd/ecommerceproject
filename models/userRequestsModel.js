const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const requestsSchema = new mongoose.Schema(
  {
    userId: {
      type: Objectid,
      required: true,
      ref: "user",
    },
    message: {
      type: String,
      required: true,
    },
    isCancel: {
      type: Boolean,
      default: false,
    },
    isReturn: {
      type: Boolean,
      default: false,
    },
    isFeedback: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userRequestModel = mongoose.model("requests", requestsSchema);
module.exports = userRequestModel;
