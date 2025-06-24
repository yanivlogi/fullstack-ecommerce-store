import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
     name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
     type: String
    }, 
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      unique: true,
    },
    sku: {
      type: String,
    },
    storeLocation: { // תואם ל־storeLocation מה־state
      type: String,
    },
    stock: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    priceSale: {
      type: Number,
    },
    priceCost: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    length: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    sellingType: {
      type: String,
      enum: ["in-store", "online", "both"],
      default: "in-store",
    },
    
  }
);

productSchema.index({ name: "text" }); // Create a text index on the 'name' field

const Product = mongoose.model("Product", productSchema);

export default Product;
