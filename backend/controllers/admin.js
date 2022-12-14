const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const isAdmin = require("../functions/isAdmin");

router.get("/userindex", isAdmin, async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.token, { complete: true });
    username = decoded.payload.username;
    const result = await User.findOne({ username: username });
    if (result.access === "admin" || result.access === "staff") {
      const allResults = await User.find({}, { username: 1, access: 1 });
      res.status(200).json(allResults);
    } else {
      res.status(403).json("Insufficient access level");
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
