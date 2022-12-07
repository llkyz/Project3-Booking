const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.redirect("/sessions/unauthenticated");
  }
};

router.get("/", isAuthenticated, async (req, res) => {
  let result = await Booking.find();
  res.json(result);
});

router.post("/", isAuthenticated, async (req, res) => {
  const id = req.params.id;

  let result = await Booking.create(req.body);
  console.log(result);
  res.redirect("/calendar");
});

router.get("/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;

  let result = await Booking.findById(id);
  res.json(result);
});

router.put("/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;

  let result = await Booking.findByIdAndUpdate(id, req.body);
  console.log(result);
  res.redirect("/calendar");
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = req.params.id;

  let result = await Booking.findByIdAndDelete(id);
  console.log(result);
  res.redirect("/calendar");
});

module.exports = router;
