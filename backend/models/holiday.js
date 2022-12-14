const mongoose = require("mongoose");

const holidaySchema = mongoose.Schema({
  dateTime: { type: Date },
  title: { type: String, required: true },
});

const Holiday = mongoose.model("Holiday", holidaySchema);

module.exports = Holiday;
