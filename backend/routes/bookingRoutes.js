const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();

// ✅ Auto-delete bookings older than 10 minutes
setInterval(async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  await Booking.deleteMany({ createdAt: { $lt: tenMinutesAgo } });
  console.log("🗑️ Old bookings cleared.");
}, 60 * 1000); // Runs every 1 minute

// ✅ Create Booking
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
