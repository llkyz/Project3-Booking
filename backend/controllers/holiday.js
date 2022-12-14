const express = require("express");
const router = express.Router();
const Holiday = require("../models/holiday");
const isAuthenticated = require("../functions/isAuthenticated");
const isStaff = require("../functions/isStaff");
const entryFindCreate = require("../functions/entryFindCreate");
const entryFindDelete = require("../functions/entryFindDelete");

router.get("/", isStaff, async (req, res) => {
  try {
    let result = await Holiday.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    let result = await Holiday.findById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", isStaff, async (req, res) => {
  try {
    console.log(req.body);
    let result = await Holiday.create(req.body);
    await entryFindCreate(req.body.dateTime, result._id, "holidays");
    console.log(result);
    console.log("New Holiday Created");
    res.status(200).json("New Holiday Created");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put("/:id", isStaff, async (req, res) => {
  try {
    let originalData = await Holiday.findById(req.params.id);
    await entryFindDelete(originalData.dateTime, req.params.id, "holidays");
    await entryFindCreate(req.body.dateTime, req.params.id, "holidays");

    let result2 = await Holiday.findByIdAndUpdate(req.params.id, req.body);
    console.log(result2);
    res.status(200).json("Holiday updated");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", isStaff, async (req, res) => {
  try {
    await entryFindDelete(req.body.dateTime, req.params.id, "holidays");
    let result = await Holiday.findByIdAndDelete(req.params.id);
    console.log(result);
    res.status(200).json("Holiday deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
