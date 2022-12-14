const express = require("express");
const router = express.Router();
const Entry = require("../models/entry");
const isAuthenticated = require("../functions/isAuthenticated");

router.get("/range", isAuthenticated, async (req, res) => {
  try {
    req.body.dateStart;
    req.body.dateEnd;
    const result = await Entry.find({
      date: {
        $gte: new Date(req.body.dateStart),
        $lt: new Date(req.body.dateEnd),
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
