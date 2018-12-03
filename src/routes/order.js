"use strict";

const authService = require("../service/authService");

const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");

router.post("/", authService.authorize, controller.post);
router.get("/", authService.authorize, controller.get);

module.exports = router;
