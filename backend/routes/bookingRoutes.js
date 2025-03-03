const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();

// Function to clear expired bookings (10 min before train arrival)
const clearExpiredBookings = async () => {
    try {
        const now = new Date();
        await Booking.deleteMany({ 
            minutesBeforeArrival: { $lte: 10 } // Delete bookings where time is <= 10 minutes
        });
        console.log("Expired bookings deleted successfully.");
    } catch (err) {
        console.error("Error deleting expired bookings:", err);
    }
};

// Run the cleanup function every 1 minute
setInterval(clearExpiredBookings, 60 * 1000);

// Create Booking
router.post("/", async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Active Bookings
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
