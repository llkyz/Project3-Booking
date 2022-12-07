const express = require("express");
const sophieData = require("../sophie");
const shopifyData = require("../shopify");
const router = express.Router();
const Booking = require("../models/booking");

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.redirect("/sessions/unauthenticated");
  }
};

router.get("/sophie", isAuthenticated, async (req, res) => {
  let result = await sophieData();
  res.json(result);
});

router.get("/shopify", isAuthenticated, async (req, res) => {
  let result = await shopifyData();
  res.json(result);
});

module.exports = router;
