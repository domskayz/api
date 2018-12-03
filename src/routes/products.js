"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/productsController");
const authService = require("../service/authService");

router.get("/", controller.get);
router.get("/:slug", controller.getBySlug);
router.get("/admin/:id", controller.getById);
router.get("/tags/:tag", controller.getByTag);

router.post("/", authService.isAdmin, controller.post);
router.put("/:id", authService.isAdmin, controller.put);
router.delete("/:id", authService.isAdmin, controller.remove);

module.exports = router;
