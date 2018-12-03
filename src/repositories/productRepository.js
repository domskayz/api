"use strict";

const mongoose = require("mongoose");
const Product = mongoose.model("Product");

const getByTag = async tag => {
  return await Product.find(
    { tags: tag, active: true },
    "title description price slug tags"
  );
};

const create = async data => {
  const product = new Product(data);
  return await product.save();
};

const update = async (id, data) => {
  return await Product.findByIdAndUpdate(id, {
    $set: {
      title: data.title,
      description: data.description,
      price: data.price,
      slug: data.slug
    }
  });
};

const get = async () => {
  return await Product.find({ active: true }, "title price slug");
};

const getById = async id => {
  return await Product.findById(id);
};

const remove = async id => {
  return await Product.findOneAndRemove(id);
};

const getBySlug = async slug => {
  return await Product.findOne(
    { active: true, slug },
    "title description price slug tags"
  );
};

module.exports = { get, getBySlug, getById, getByTag, create, update, remove };
