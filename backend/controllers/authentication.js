const express = require("express");
const authenticator = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

authenticator.get("/", (req, res) => {
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

module.exports = authenticator;
