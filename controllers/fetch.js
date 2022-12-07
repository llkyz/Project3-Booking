const express = require("express");
const sophieData = require("../sophie");
const shopifyData = require("../shopify");
const router = express.Router();
const Booking = require("../models/booking");

router.get("/sophie", async (req, res) => {
  let result = await sophieData();
  res.json(result);
});

router.get("/shopify", async (req, res) => {
  let result = await shopifyData();
  res.json(result);
});

module.exports = router;
