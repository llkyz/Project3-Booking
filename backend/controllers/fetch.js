const express = require("express");
const sophieData = require("./fetch/sophie");
const shopifyData = require("./fetch/shopify");
const router = express.Router();
const Booking = require("../models/booking");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/sophie", isAuthenticated, async (req, res) => {
  let result = await sophieData();

  for (let x = 0; x < result.length; x++) {
    const searchResult = await Booking.find({
      origin: result[x].origin,
      id: result[x].id,
    });
    if (searchResult.length != 0) {
      result.splice(x, 1);
      x--;
    }
  }

  res.status(200).json(result);
});

router.get("/shopify", isAuthenticated, async (req, res) => {
  let result = await shopifyData();

  for (let x = 0; x < result.length; x++) {
    const searchResult = await Booking.find({
      origin: result[x].origin,
      id: result[x].id,
    });
    if (searchResult.length != 0) {
      result.splice(x, 1);
      x--;
    }
  }

  res.status(200).json(result);
});

module.exports = router;
