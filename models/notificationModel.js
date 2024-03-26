const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: Objectid,
      required: true,
      ref: "user",
      unique: true,
    },
    messages: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model("notifications", notificationSchema);
module.exports = notificationModel;
