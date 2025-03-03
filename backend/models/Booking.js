const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    passengerName: String,
    trainNumber: String,
    coachNumber: String,
    station: String,
    minutesBeforeArrival: Number,
    cooliesNeeded: Number,
    status: { type: String, default: "Pending" },
}, { timestamps: true }); // ✅ Adds createdAt automatically

module.exports = mongoose.model("Booking", BookingSchema);
