const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  dateTime: { type: Date },
  type : { type: String, required: true },
  title: {type: String, required: true},
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;