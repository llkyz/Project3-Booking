const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  origin: { type: String, required: true },
  id: { type: Number, required: true },
  price: { type: Number },
  participants: { type: Number },
  dateTime: { type: Date },
  customer: { type: String },
  contact: { type: String },
  ignore: { type: Boolean, default: false },
  complete: { type: Boolean, default: false },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
