const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  passengerName: String,
  trainNumber: String,
  coachNumber: String,
  station: String,
  minutesBeforeArrival: Number,
  cooliesNeeded: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now, expires: '1d' } // Auto-delete after 1 day
});

module.exports = mongoose.model("Booking", BookingSchema);
