const mongoose = require("mongoose");

const pickupSchema = mongoose.Schema({
  dateTime: { type: Date },
  customer: { type: String, required: true },
  item: { type: String, required: true },
});

const Pickup = mongoose.model("Pickup", pickupSchema);

module.exports = Pickup;
