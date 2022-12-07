const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

router.get("/", async (req, res) => {
  let result = await Booking.find();
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  let result = await Booking.findById(id);
  res.json(result);
});

router.post("/:id", async (req, res) => {
  const id = req.params.id;

  let result = await Booking.create(req.body);
  console.log(result);
  res.redirect("/calendar");
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  let result = await Booking.findByIdAndUpdate(id, req.body);
  console.log(result);
  res.redirect("/calendar");
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  let result = await Booking.findByIdAndDelete(id);
  console.log(result);
  res.redirect("/calendar");
});

module.exports = router;
