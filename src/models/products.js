"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true // remove space between the title
  },
  slug: {
    type: String,
    required: [true, "O Slug é Obrigatorio"],
    trim: true,
    index: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  tags: [
    {
      type: String,
      required: true
    }
  ]
});

module.exports = mongoose.model("Product", ProductSchema);
