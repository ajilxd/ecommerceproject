const mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const couponSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    discountAmount:{
        type:Number,
        required:true
    },
    criteriaAmount:{
        type:Number,
        required:true
    },
    usedUsers:{
        type:Array,
        ref:"User",
        default:[]
    },
    limit:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:false,
        required:true
    },
    expiryDate:{
        type: Date,
        required:true
    }
  },
  {
    timestamps:true
  })

  const CouponModel = mongoose.model("Coupon", couponSchema);
  module.exports = CouponModel