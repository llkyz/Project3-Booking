const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const isStaff = require("../functions/isStaff");
const entryFindCreate = require("../functions/entryFindCreate");
const entryFindDelete = require("../functions/entryFindDelete");

router.get("/", isStaff, async (req, res) => {
  try {
    let result = await Booking.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", isStaff, async (req, res) => {
  try {
    let result = await Booking.findById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", isStaff, async (req, res) => {
  try {
    let result = await Booking.create(req.body);
    await entryFindCreate(req.body.dateTime, result._id, "bookings");
    console.log(result);
    console.log("New Booking Created");
    res.status(200).json("New Booking Created");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", isStaff, async (req, res) => {
  try {
    let originalData = await Booking.findById(req.params.id);
    await entryFindDelete(originalData.dateTime, req.params.id, "bookings");
    if (!req.body.ignore && !req.body.complete) {
      await entryFindCreate(req.body.dateTime, req.params.id, "bookings");
    }

    let result2 = await Booking.findByIdAndUpdate(req.params.id, req.body);
    console.log(result2);
    res.status(200).json("Booking updated");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", isStaff, async (req, res) => {
  try {
    await entryFindDelete(req.body.dateTime, req.params.id, "bookings");
    let result = await Booking.findByIdAndDelete(req.params.id);
    console.log(result);
    res.status(200).json("Booking deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
