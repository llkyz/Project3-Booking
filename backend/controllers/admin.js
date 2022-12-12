const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const isAuthenticated = require("../functions/isAuthenticated");

router.get("/userindex", isAuthenticated, async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.token, { complete: true });
    username = decoded.payload.username;
    const result = await User.findOne({ username: username });
    if (result.access === "admin") {
      const allResults = await User.find(
        {},
        { username: 1, access: 1, _id: 0 }
      );
      res.status(200).json(allResults);
    } else {
      res.status(403).json("Insufficient access level");
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
