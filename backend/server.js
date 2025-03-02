const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const http = require("http");

dotenv.config(); // Load .env file

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Fetch MongoDB URI from .env

// Database Connection
if (!MONGO_URI) {
  console.error("❌ MongoDB connection string is missing in .env file");
  process.exit(1); // Stop the server if no connection string
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });


// WebSocket Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("newBooking", (data) => {
    io.emit("updateBookings", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Routes
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
