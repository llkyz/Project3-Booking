const express = require("express");
const router = express.Router();
const Entry = require("../models/entry");
const isAuthenticated = require("../functions/isAuthenticated");

router.get("/range/:year&:month", isAuthenticated, async (req, res) => {
  try {
    const result = await Entry.find({
      date: {
        $gte: new Date(req.params.year, req.params.month, 1),
        $lte: new Date(req.params.year, parseInt(req.params.month) + 1, 1),
      },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:date", isAuthenticated, async (req, res) => {
  try {
    let oldDate = new Date(req.params.date).getTime();
    let adjustedDate = new Date(oldDate + 8 * 60 * 60 * 1000);
    const result = await Entry.findOne({ date: adjustedDate });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
