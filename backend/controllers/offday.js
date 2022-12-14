const express = require("express");
const router = express.Router();
const Offday = require("../models/offday");
const isAuthenticated = require("../functions/isAuthenticated");
const isStaff = require("../functions/isStaff");
const entryFindCreate = require("../functions/entryFindCreate");
const entryFindDelete = require("../functions/entryFindDelete");

router.get("/", isStaff, async (req, res) => {
  try {
    let result = await Offday.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    let result = await Offday.findById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", isStaff, async (req, res) => {
  try {
    let result = await Offday.create(req.body);
    await entryFindCreate(req.body.dateTime, result._id, "offdays");
    console.log(result);
    console.log("New Offday Created");
    res.status(200).json("New Offday Created");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", isStaff, async (req, res) => {
  try {
    let originalData = await Offday.findById(req.params.id);
    await entryFindDelete(originalData.dateTime, req.params.id, "offdays");
    await entryFindCreate(req.body.dateTime, req.params.id, "offdays");

    let result2 = await Offday.findByIdAndUpdate(req.params.id, req.body);
    console.log(result2);
    res.status(200).json("Offday updated");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", isStaff, async (req, res) => {
  try {
    await entryFindDelete(req.body.dateTime, req.params.id, "offdays");
    let result = await Offday.findByIdAndDelete(req.params.id);
    console.log(result);
    res.status(200).json("Offday deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
