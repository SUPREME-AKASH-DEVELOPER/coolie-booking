const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  passengerName: String,
  trainNumber: String,
  coachNumber: String,
  station: String,
  minutesBeforeArrival: Number,
  cooliesNeeded: Number,
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Booking", BookingSchema);
