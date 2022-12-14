const mongoose = require("mongoose");

const offdaySchema = mongoose.Schema({
  dateTime: { type: Date },
  staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reason: { type: String, required: true },
});

const Offday = mongoose.model("Offday", offdaySchema);

module.exports = Offday;
