const express = require("express");
const sessions = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

sessions.get("/unauthenticated", async (req, res) => {
  res
    .status(401)
    .send(
      "<h1>Error 401: Unauthorized</h1><h4>Please log in to use the app</h4>"
    );
});

sessions.post("/", async (req, res) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });
    if (!foundUser) {
      res.send("No User found");
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser;
        res.redirect("/");
      } else {
        res.send("Password does not match");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

sessions.delete("/", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = sessions;
