const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const User = require("../models/user");

async function IsAdmin(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).send("Token not found");
    } else {
      jwt.verify(token, secret, async function (err, decoded) {
        if (err) {
          res.status(401).send("Invalid token");
        } else {
          req.username = decoded.username;
          const result = await User.findOne({ username: req.username });
          if (result.access === "admin") {
            next();
          } else {
            res.status(403).json("Insufficient access level");
          }
        }
      });
    }
  } catch (err) {
    res.status(400).json(err);
  }
}

module.exports = IsAdmin;
