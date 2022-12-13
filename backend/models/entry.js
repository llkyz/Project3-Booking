const mongoose = require("mongoose");

const entrySchema = mongoose.Schema({
  date: { type: Date },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
