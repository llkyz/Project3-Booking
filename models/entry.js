const mongoose = require("mongoose");

const entrySchema = mongoose.Schema({
  date: { type: Date, required: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  holidays: [{ type: mongoose.Schema.Types.ObjectId, ref: "Holiday" }],
  offdays: [{ type: mongoose.Schema.Types.ObjectId, ref: "Offday" }],
  pickups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pickup" }],
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
