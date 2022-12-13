const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const isAuthenticated = require("../functions/isAuthenticated");

router.get("/index", isAuthenticated, async (req, res) => {
  try {
      let result = await Booking.find();
      res.status(200).json(result);
  } catch (err) {
      res.status(400).json(err)
  }
  });

router.post("/", isAuthenticated, async (req, res) => {
  try {
    let result = await Booking.create(req.body);
    console.log(result);
    console.log("New Booking Created");
    res.status(200).json("New Booking Created");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/", isAuthenticated, async (req, res) => {
  try {
      let _id = req.body._id
      delete req.body._id
      let result = await Booking.findByIdAndUpdate(_id, req.body);
      console.log(result);
      res.status(200).json("Booking updated")
  } catch (err) {
      res.status(400).json(err)
  }
});

router.delete("/", isAuthenticated, async (req, res) => {
  try {
      let result = await Booking.findByIdAndDelete(req.body._id);
      console.log(result);
      res.status(200).json("Booking deleted")
  } catch (err) {
      res.status(400).json(err)
  }
});

module.exports = router;