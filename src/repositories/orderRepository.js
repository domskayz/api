"use strict";

const mongoose = require("mongoose");
const Order = mongoose.model("Order");

const create = async data => {

  const order = new Order(data);
  return await order.save();
};

const get = async () => {
  return await Order.find({}, "number status price")
    .populate("items", "name email")
    .populate("items.product", "title price description");
};

module.exports = {
  create,
  get
};
