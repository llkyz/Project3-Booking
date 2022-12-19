const express = require("express");
const router = express.Router();
const Pickup = require("../models/pickup");
const isStaff = require("../functions/isStaff");
const entryFindCreate = require("../functions/entryFindCreate");
const entryFindDelete = require("../functions/entryFindDelete");

router.get("/", isStaff, async (req, res) => {
  try {
    let result = await Pickup.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", isStaff, async (req, res) => {
  try {
    let result = await Pickup.findById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", isStaff, async (req, res) => {
  try {
    let result = await Pickup.create(req.body);
    await entryFindCreate(req.body.dateTime, result._id, "pickups");
    console.log(result);
    console.log("New Pickup Created");
    res.status(200).json("New Pickup Created");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", isStaff, async (req, res) => {
  try {
    let originalData = await Pickup.findById(req.params.id);
    await entryFindDelete(originalData.dateTime, req.params.id, "pickups");
    await entryFindCreate(req.body.dateTime, req.params.id, "pickups");

    let result2 = await Pickup.findByIdAndUpdate(req.params.id, req.body);
    console.log(result2);
    res.status(200).json("Pickup updated");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", isStaff, async (req, res) => {
  try {
    await entryFindDelete(req.body.dateTime, req.params.id, "pickups");
    let result = await Pickup.findByIdAndDelete(req.params.id);
    console.log(result);
    res.status(200).json("Pickup deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
