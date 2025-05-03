const mongoose = require("mongoose");

const orderShcema = mongoose.Schema({
  orderItems: [
    {
      quantity: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    },
  ],

  shippingAddress: {
    type: String
  },
  city: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "UPI", "Card"],
    required: true,
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "register",
  },
  dateOrderd: {
    type: Date,
    default: Date.now,
  },
});

exports.Order = mongoose.model("Order", orderShcema);




