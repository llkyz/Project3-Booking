const mongoose = require("mongoose");

const offdaySchema = mongoose.Schema({
  dateTime: { type: Date, required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  staffName: { type: String },
  reason: { type: String },
});

const Offday = mongoose.model("Offday", offdaySchema);

module.exports = Offday;
