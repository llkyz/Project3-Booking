const express = require('express')
const router = express.Router()
const Event = require("../models/event")
const isAuthenticated = require('../functions/isAuthenticated')

router.get("/index", isAuthenticated, async (req, res) => {
    try {
        let result = await Event.find();
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json(err)
    }
    });
  
  router.post("/", isAuthenticated, async (req, res) => {
    try {
      let result = await Event.create(req.body);
      console.log(result);
      console.log("New Event Created");
      res.status(200).json("New Event Created");
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  router.put("/", isAuthenticated, async (req, res) => {
    try {
        let _id = req.body._id
        delete req.body._id
        let result = await Event.findByIdAndUpdate(_id, req.body);
        console.log(result);
        res.status(200).json("Event updated")
    } catch (err) {
        res.status(400).json(err)
    }
  });
  
  router.delete("/", isAuthenticated, async (req, res) => {
    try {
        let result = await Event.findByIdAndDelete(req.body._id);
        console.log(result);
        res.status(200).json("Event deleted")
    } catch (err) {
        res.status(400).json(err)
    }
  });
  
  module.exports = router;