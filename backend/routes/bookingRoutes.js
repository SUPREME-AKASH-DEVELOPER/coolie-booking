const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();

// Function to delete expired bookings (10 minutes after "minutes before arrival")
const deleteExpiredBookings = async () => {
  const currentTime = new Date();

  await Booking.deleteMany({
    $expr: {
      $lt: [
        { $add: ["$createdAt", { $multiply: ["$minutesBeforeArrival", 60000] }, 10 * 60000] }, // CreatedAt + minutesBeforeArrival + 10 minutes
        currentTime
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

// 📌 Clear All Bookings Manually
router.delete("/clear", async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.json({ message: "All active bookings cleared!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
