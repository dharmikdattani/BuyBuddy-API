const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema({
  id: {
    _id: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  quantity: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("payment", paymentSchema);
