const express = require("express");
const sophieData = require("../functions/sophie");
const shopifyData = require("../functions/shopify");
const router = express.Router();
const Booking = require("../models/booking");
const isStaff = require("../functions/isStaff");

router.get("/sophie", isStaff, async (req, res) => {
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

router.get("/shopify", isStaff, async (req, res) => {
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
