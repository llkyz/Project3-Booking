const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.send("User");
});

router.post("/", async (req, res) => {
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  let newUser = await User.create(req.body);
  console.log("Created new User: ", newUser);
  res.redirect("/user");
});

router.get("/:id", async (req, res) => {
  let result = await User.findById(req.params.id);

  res.json(result);
});

router.put("/:id", async (req, res) => {
  let result = await User.findByIdAndUpdate(req.params.id, req.body);
  console.log("Updated User: ", result);
  res.redirect("/");
});

router.delete("/:id", async (req, res) => {
  let result = await User.findByIdAndDelete(req.params.id);
  console.log("Deleted User: ", result);
  res.redirect("/");
});

module.exports = router;
