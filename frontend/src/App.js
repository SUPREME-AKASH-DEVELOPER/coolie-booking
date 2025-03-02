import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css"; // Make sure to create and link this CSS file

const socket = io("https://coolie-booking-service.onrender.com");

const App = () => {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    passengerName: "",
    trainNumber: "",
    coachNumber: "",
    station: "",
    minutesBeforeArrival: "",
    cooliesNeeded: "",
  });

  useEffect(() => {
    axios.get("https://coolie-booking-service.onrender.com/api/bookings").then((res) => setBookings(res.data));
    
    socket.on("updateBookings", (newBooking) => {
      setBookings((prev) => [...prev, newBooking]);
    });

    return () => socket.off("updateBookings");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("https://coolie-booking-service.onrender.com/api/bookings", form);
    socket.emit("newBooking", res.data);
    setForm({ passengerName: "", trainNumber: "", coachNumber: "", station: "", minutesBeforeArrival: "", cooliesNeeded: "" });
  };

  return (
    <div className="container">
      <div className="booking-form">
        <h1>🚆 Coolie Booking Service</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="passengerName" placeholder="Passenger Name" value={form.passengerName} onChange={handleChange} required />
          <input type="text" name="trainNumber" placeholder="Train Number" value={form.trainNumber} onChange={handleChange} required />
          <input type="text" name="coachNumber" placeholder="Coach Number" value={form.coachNumber} onChange={handleChange} required />
          <input type="text" name="station" placeholder="Station Name" value={form.station} onChange={handleChange} required />
          <input type="number" name="minutesBeforeArrival" placeholder="Minutes Before Arrival" value={form.minutesBeforeArrival} onChange={handleChange} required />
          <input type="number" name="cooliesNeeded" placeholder="Coolies Needed" value={form.cooliesNeeded} onChange={handleChange} required />
          <button type="submit">Book Coolie 🚀</button>
        </form>
      </div>

      <div className="active-bookings">
        <h2>📋 Active Bookings:</h2>
        <div>
          {bookings.length === 0 ? (
            <p>No active bookings</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Train No.</th>
                  <th>Coach No.</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, index) => (
                  <tr key={index}>
                    <td>{b.passengerName}</td>
                    <td>{b.trainNumber}</td>
                    <td>{b.coachNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;