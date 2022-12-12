const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  dateTime: { type: Date },
  type : { type: String },
  title: {type: String},
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;