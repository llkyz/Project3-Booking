const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Entry = require("../models/entry");
const isAuthenticated = require("../functions/isAuthenticated");
const entryFindCreate = require("../functions/entryFindCreate");
const entryFindMove = require("../functions/entryFindMove");
const entryFindDelete = require("../functions/entryFindDelete");

router.get("/index", isAuthenticated, async (req, res) => {
  try {
    let result = await Booking.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    let result = await Booking.create(req.body);
    console.log("New Booking Created");

    let foundEntry = await entryFindCreate(req.body.dateTime);
    await Entry.findByIdAndUpdate(foundEntry._id, {
      $push: { bookings: result._id },
    });

    res.status(200).json("New Booking Created");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/", isAuthenticated, async (req, res) => {
  try {
    let _id = req.body._id;
    delete req.body._id;
    let result2 = await Booking.findByIdAndUpdate(_id, req.body);
    console.log(result2);
    res.status(200).json("Booking updated");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/", isAuthenticated, async (req, res) => {
  try {
    await entryFindDelete(req.body.dateTime, req.body._id, "bookings");
    let result = await Booking.findByIdAndDelete(req.body._id);
    console.log(result);
    res.status(200).json("Booking deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
