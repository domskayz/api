"use strict";

const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");

const create = async data => {
  const customer = new Customer(data);
  return await customer.save();
};

const authenticate = async data => {
  const { email, password } = data;
  return await Customer.findOne({ email, password });
};

const getById = async id => await Customer.findById(id);

module.exports = {
  create,
  authenticate,
  getById
};
