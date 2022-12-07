const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("User");
});

router.get("/:id", async (req, res) => {
  let result = await User.findById(req.params.id);

  res.json(result);
});

router.post("/", async (req, res) => {
  let result = await User.create(req.body);
  // use bcrypt to encode password here
  console.log(result);
  res.redirect("/user");
});

router.put("/:id");

module.exports = router;
