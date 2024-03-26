const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Define index on createdAt field to expire documents after 60 seconds
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

const otpModel = mongoose.model("otp", otpSchema);

module.exports = otpModel;
