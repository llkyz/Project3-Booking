const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", (req, res) => {
  // res.send("User");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username: username }, async function (err, user) {
    if (err) {
      console.log(err);
    } else if (!user) {
      res.status(401).send("Invalid username or password");
    } else {
      if (await bcrypt.compare(password, user.password)) {
        console.log("Password matches, give token");
        const payload = { username };
        const token = jwt.sign(payload, process.env.SECRET, {
          expiresIn: "1h",
        });
        res
          .status(200)
          .cookie("token", token, { httpOnly: true })
          .redirect("http://127.0.0.1:3000/");
      } else {
        res.status(401).send("Invalid username or password");
      }
    }
  });
});

router.post("/", async (req, res) => {
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  let newUser = await User.create(req.body);
  console.log("Created new User: ", newUser);
  res.redirect("http://127.0.0.1:3000/");
});

router.get("/:id", isAuthenticated, async (req, res) => {
  let result = await User.findById(req.params.id);

  res.json(result);
});

router.put("/:id", isAuthenticated, async (req, res) => {
  let result = await User.findByIdAndUpdate(req.params.id, req.body);
  console.log("Updated User: ", result);
  res.redirect("/");
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  let result = await User.findByIdAndDelete(req.params.id);
  console.log("Deleted User: ", result);
  res.redirect("/");
});

module.exports = router;
