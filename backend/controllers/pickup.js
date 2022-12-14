const express = require("express");
const router = express.Router();
const Pickup = require("../models/pickup");
const isAuthenticated = require("../functions/isAuthenticated");
const entryFindCreate = require("../functions/entryFindCreate");
const entryFindDelete = require("../functions/entryFindDelete");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    let result = await Pickup.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", isAuthenticated, async (req, res) => {
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

router.put("/", isAuthenticated, async (req, res) => {
  try {
    let originalData = await Pickup.findById(req.body._id);
    await entryFindDelete(originalData.dateTime, req.body._id, "pickups");
    await entryFindCreate(req.body.dateTime, req.body._id, "pickups");

    let _id = req.body._id;
    delete req.body._id;
    let result2 = await Pickup.findByIdAndUpdate(_id, req.body);
    console.log(result2);
    res.status(200).json("Pickup updated");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/", isAuthenticated, async (req, res) => {
  try {
    await entryFindDelete(req.body.dateTime, req.body._id, "pickups");
    let result = await Pickup.findByIdAndDelete(req.body._id);
    console.log(result);
    res.status(200).json("Pickup deleted");
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
