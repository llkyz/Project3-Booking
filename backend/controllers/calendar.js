const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const isAuthenticated = require("../functions/isAuthenticated");

router.get("/index", isAuthenticated, async (req, res) => {
  let result = await Booking.find();
  res.json(result);
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    let result = await Booking.create(req.body);
    console.log(result);
    console.log("New Entry Created");
    res.status(200).json("New Entry Created");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", isAuthenticated, async (req, res) => {
  console.log(req.body)

  // let result = await Booking.findById(id);
  // res.json(result);
});

router.put("/", isAuthenticated, async (req, res) => {
  let id = req.body.id

  delete req.body.id

  let result = await Booking.findByIdAndUpdate(id, req.body);
  console.log(result);
  res.status(200).json("Booking updated")
});

router.delete("/", isAuthenticated, async (req, res) => {
  let result = await Booking.findByIdAndDelete(req.body.id);
  console.log(result);
  res.status(200).json("Booking deleted")
  // res.redirect("/calendar");
});

module.exports = router;
