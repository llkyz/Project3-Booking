const express = require("express");
const sophieData = require("./fetch/sophie");
const shopifyData = require("./fetch/shopify");
const router = express.Router();
const Booking = require("../models/booking");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/sophie", isAuthenticated, async (req, res) => {
  let result = await sophieData();
  res.json(result);
});

router.get("/shopify", isAuthenticated, async (req, res) => {
  let result = await shopifyData();
  res.json(result);
});

module.exports = router;
