mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Objectid,
      ref: "categories",
    },
    isCategoryBlocked: {
      type: Boolean,
    },
    quantity: {
      type: Number,
    },
    rating:{
      type:Number,
      default:5
    },
      productOfferId:{
        type:Objectid,
        ref:"offerModel"
      },
      categoryOfferId:{
        type:Objectid,
        ref:"offerModel"
      },
      originalPrice:{
        type:Number
      },
      productDiscount:{
        type:Number
      },
      categoryDiscount:{
        type:Number
      }
    
  },
  {
    timestamps: true,
  }
);

const productModel = new mongoose.model("products", productSchema);
module.exports = productModel;
