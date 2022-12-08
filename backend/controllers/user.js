const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const decoded = jwt.decode(req.cookies.token, { complete: true });
    username = decoded.payload.username;
    const result = await User.findOne({ username: username });
    res.status(200).json({ username: result.username, access: result.access });
  } catch (err) {
    res.status(400).json(err);
  }
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
        console.log("Logged in, token issued");
        const payload = { username };
        const token = jwt.sign(payload, process.env.SECRET, {
          expiresIn: "1h",
        });
        res
          .status(200)
          .cookie("token", token, { httpOnly: true })
          .redirect(process.env.FRONTEND_URL);
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
  res.redirect(process.env.FRONTEND_URL);
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
