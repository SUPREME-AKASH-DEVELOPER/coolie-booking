const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();

// Function to delete expired bookings (10 minutes after "minutesBeforeArrival")
const deleteExpiredBookings = async () => {
  const currentTime = new Date();
  
  await Booking.deleteMany({
    $expr: {
      $lt: [
        { $subtract: [currentTime, { $multiply: ["$minutesBeforeArrival", 60000] }] }, // Convert minutes to milliseconds
        10 * 60 * 1000 // 10 minutes in milliseconds
      ]
    }
  });

  console.log("Expired bookings deleted successfully.");
};

// Run cleanup every 10 minutes
setInterval(deleteExpiredBookings, 10 * 60 * 1000);

// 📌 Create Booking
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get Active Bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Pending" });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
