const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const User = require("../models/user");

router.get("/checktoken", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json("Token not found");
  } else {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        res.status(401).json("Invalid token");
      } else {
        res.status(200).json("Token Verified");
      }
    });
  }
});

router.get("/checkaccess", async (req, res) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    res.status(401).json("Token not found");
  } else {
    jwt.verify(token, secret, async function (err, decoded) {
      if (err) {
        res.status(401).json("Invalid token");
      } else {
        let result = await User.findOne({ username: decoded.username });
        console.log(`[${result.username}] Access Level: ${result.access}`);
        res.status(200).json(result.access);
      }
    });
  }
});

module.exports = router;
