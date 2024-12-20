import React, { useState } from "react";
import "../../assets/css/ClientDashboard/BookingHistory.css";

const BookingHistory = ({ bookings }) => {
    const [filter, setFilter] = useState("all");

    const filteredBookings = bookings.filter((booking) => {
        if (filter === "all") return true;
        if (filter === "paid") return booking.paymentStatus === true;
        if (filter === "pending") return booking.paymentStatus === false;
        return true;
    });

    return (
        <div className="flight-booking">
            <div className="flight-booking__header">
                <h2 className="flight-booking__title">Booking History</h2>
                <div className="flight-booking__filter">
                    <label className="flight-booking__filter-label">Filter:</label>
                    <select
                        className="flight-booking__filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Bookings</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="flight-booking__empty">
                    <p>No bookings found.</p>
                </div>
            ) : (
                <div className="flight-booking__table-wrapper">
                    <table className="flight-booking__table">
                        <thead>
                            <tr>
                                <th>Flight Code</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.flightCode}</td>
                                    <td>{booking.from}</td>
                                    <td>{booking.to}</td>
                                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                                    <td>${booking.price.toFixed(2)}</td>
                                    <td>
                                        <span
                                            className={`flight-booking__status ${
                                                booking.paymentStatus ? "paid" : "pending"
                                            }`}
                                        >
                                            {booking.paymentStatus ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="flight-booking__action-btn"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
