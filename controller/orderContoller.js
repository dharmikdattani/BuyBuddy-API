const Validator = require("validatorjs");
const { Order } = require("../models/orderModels");
const { default: orderSchema } = require("../schema/orderSchema");
const Product = require('../models/product');


//get userOrder Api
const userOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("orderItems");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//get orderList Api
const orderList = async (req, res) => {
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const skip = (page - 1) * limit;
  try {
    const orderList = await Order.find({}, null, { skip, limit });
    const totalOrders = await Order.countDocuments({});
    const totalPages = Math.ceil(totalOrders / limit);

    if (!orderList) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    res.json({
      success: true,
      message: "Orders fetched successfully",
      data: orderList,
      pagiantion: {
        current_pages: page,
        total_pages: totalPages,
        next: page < totalPages,
        previous: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
//post createOrder API
const rules = {
  "orderItems.*.quantity": "required|numeric",
  "orderItems.*.product": "required|string",
  shippingAddress: "required|string",
  city: "required|string",
  country: "required|string",
  code: "required|string",
  phone: "required|string",
  status: "required|string",
  paymentMethod: "required|string",
  totalPrice: "required|numeric",
  user: "required|string",
};

const mongoose = require("mongoose");


const createOrder = async (req, res) => {
  try {

    const { error, value } = orderSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      orderItems,
      shippingAddress,
      city,
      country,
      code,
      phone,
      status,
      paymentMethod,
      totalPrice,
      user,
    } = value;

    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    for (const item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ success: false, error: `Invalid product ID format: ${item.product}` });
      }
      const productExists = await Product.exists({ _id: item.product });
      if (!productExists) {
        return res.status(404).json({ success: false, error: `Record not found: ${item.product}` });
      }
    }

    const order = new Order({
      orderItems,
      shippingAddress,
      city,
      country,
      code,
      phone,
      status,
      paymentMethod,
      totalPrice,
      user,
    });

    await order.save();
    res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { userOrder, orderList, createOrder };
