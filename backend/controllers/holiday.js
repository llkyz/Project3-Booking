const express = require("express");
const router = express.Router();
const Holiday = require("../models/holiday");
const isAuthenticated = require("../functions/isAuthenticated");
const entryFindCreate = require("../functions/entryFindCreate");
const entryFindDelete = require("../functions/entryFindDelete");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    let result = await Holiday.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  try {
    let result = await Holiday.create(req.body);
    await entryFindCreate(req.body.dateTime, result._id, "holidays");
    console.log(result);
    console.log("New Holiday Created");
    res.status(200).json("New Holiday Created");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/", isAuthenticated, async (req, res) => {
  try {
    let originalData = await Holiday.findById(req.body._id);
    await entryFindDelete(originalData.dateTime, req.body._id, "holidays");
    await entryFindCreate(req.body.dateTime, req.body._id, "holidays");

    let _id = req.body._id;
    delete req.body._id;
    let result2 = await Holiday.findByIdAndUpdate(_id, req.body);
    console.log(result2);
    res.status(200).json("Holiday updated");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/", isAuthenticated, async (req, res) => {
  try {
    await entryFindDelete(req.body.dateTime, req.body._id, "holidays");
    let result = await Holiday.findByIdAndDelete(req.body._id);
    console.log(result);
    res.status(200).json("Holiday deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
