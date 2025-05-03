const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  deleted: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    ref: "Cateogory",

  },
  subCategory: {
    type: String,
    ref: "SubCategory",

  }
});


module.exports = mongoose.model('product', productSchema);