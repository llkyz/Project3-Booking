const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  origin: { type: String, required: true },
  id: { type: Number },
  price: { type: Number },
  participants: { type: Number },
  dateTime: { type: Date, required: true },
  customer: { type: String },
  contact: { type: String },
  ignore: { type: Boolean, default: false },
  complete: { type: Boolean, default: false },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
