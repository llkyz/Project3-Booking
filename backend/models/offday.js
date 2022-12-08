const mongoose = require("mongoose");

const offdaySchema = mongoose.Schema({
  dateTime: { type: Date },
  user: { type: String },
  reason: { type: String },
});

const Offday = mongoose.model("Offday", offdaySchema);

module.exports = Offday;
