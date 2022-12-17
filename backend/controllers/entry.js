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

router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const result = await Entry.findById(req.body.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
