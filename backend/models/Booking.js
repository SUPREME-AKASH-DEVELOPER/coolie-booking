const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  passengerName: String,
  trainNumber: String,
  coachNumber: String,
  station: String,
  minutesBeforeArrival: Number,
  cooliesNeeded: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

// Auto-delete expired bookings when fetched
BookingSchema.pre("find", function (next) {
  this.where("createdAt").gt(new Date(Date.now() - 24 * 60 * 60 * 1000)); // 24 hours
  next();
});

module.exports = mongoose.model("Booking", BookingSchema);
