const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();

// Function to delete a booking after 10 minutes of arrival time
const scheduleDeletion = async (booking) => {
    const deleteTime = booking.createdAt.getTime() + (booking.minutesBeforeArrival + 10) * 60 * 1000;

    const delay = deleteTime - Date.now(); // Calculate remaining time

    if (delay > 0) {
        setTimeout(async () => {
            await Booking.findByIdAndDelete(booking._id);
            console.log(`Booking ${booking._id} deleted successfully.`);
        }, delay);
    }
};

// Create Booking
router.post("/", async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        scheduleDeletion(newBooking); // Schedule automatic deletion
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
