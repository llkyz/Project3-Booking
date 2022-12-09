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
      res.status(401).json("Invalid username or password");
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
          .json("Login Successful");
      } else {
        res.status(401).json("Invalid username or password");
      }
    }
  });
});

router.post("/", async (req, res) => {
  let userExists = await User.findOne({ username: req.body.username });
  if (userExists) {
    res.status(401).json("Username already exists");
  } else if (req.body.username < 3) {
    res.status(401).json("Valid username");
  } else {
    let password = req.body.password;

    let testLowerCase = /[a-z]/;
    let testUpperCase = /[A-Z]/;
    let testNumber = /[0-9]/;

    let lowerCase = testLowerCase.test(password);
    let upperCase = testUpperCase.test(password);
    let number = testNumber.test(password);
    let length = password.length >= 8;

    if (lowerCase && upperCase && number && length) {
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
      let newUser = await User.create(req.body);
      console.log("Created new User: ", newUser);
      res.status(200).json("Registration successful");
    } else {
      res.status(401).json("Password not valid");
    }
  }
});

router.get("/:id", isAuthenticated, async (req, res) => {
  let result = await User.findById(req.params.id);

  res.json(result);
});

router.put("/", isAuthenticated, async (req, res) => {
  console.log(req.body);
  User.findOne({ username: req.body.username }, async function (err, user) {
    if (err) {
      console.log(err);
      res.status(401).json("Error");
    } else if (!user) {
      res.status(401).json("Can't find user");
    } else {
      if (await bcrypt.compare(req.body.currentpassword, user.password)) {
        let result = await User.updateOne(
          { username: req.body.username },
          {
            $set: {
              password: bcrypt.hashSync(
                req.body.newpassword,
                bcrypt.genSaltSync(10)
              ),
            },
          }
        );
        console.log("Updated User: ", result);
        res.status(200).json("OK");
      } else {
        res.status(401).json("Passwords do not match");
      }
    }
  });
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  let result = await User.findByIdAndDelete(req.params.id);
  console.log("Deleted User: ", result);
  res.redirect("/");
});

module.exports = router;
