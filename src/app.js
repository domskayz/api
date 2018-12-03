"use strict";

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config");

// load models
const Product = require("./models/products");
const Customer = require("./models/customer");
const Order = require("./models/order");
const md5 = require("md5");

// loading routes
const indexRoute = require("./routes/index");
const productRoutes = require("./routes/products");
const customerRoutes = require("./routes/customer");
const orderRoutes = require("./routes/order");

// connect database

mongoose.connect(config.connectingString);


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use("/", indexRoute);
app.use("/products", productRoutes);
app.use("/customers", customerRoutes);
app.use("/orders", orderRoutes);

module.exports = app;
