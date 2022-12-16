const mongoose = require("mongoose");

const pickupSchema = mongoose.Schema({
  dateTime: { type: Date, required: true },
  customer: { type: String, required: true },
  item: { type: String },
});

const Pickup = mongoose.model("Pickup", pickupSchema);

module.exports = Pickup;
