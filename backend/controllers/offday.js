const express = require("express");
const router = express.Router();
const Offday = require("../models/offday");
const isAuthenticated = require("../functions/isAuthenticated");
const entryFindCreate = require("../functions/entryFindCreate");
const entryFindDelete = require("../functions/entryFindDelete");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    let result = await Offday.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", isAuthenticated, async (req, res) => {
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

router.put("/", isAuthenticated, async (req, res) => {
  try {
    let originalData = await Offday.findById(req.body._id);
    await entryFindDelete(originalData.dateTime, req.body._id, "offdays");
    await entryFindCreate(req.body.dateTime, req.body._id, "offdays");

    let _id = req.body._id;
    delete req.body._id;
    let result2 = await Offday.findByIdAndUpdate(_id, req.body);
    console.log(result2);
    res.status(200).json("Offday updated");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/", isAuthenticated, async (req, res) => {
  try {
    await entryFindDelete(req.body.dateTime, req.body._id, "offdays");
    let result = await Offday.findByIdAndDelete(req.body._id);
    console.log(result);
    res.status(200).json("Offday deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
