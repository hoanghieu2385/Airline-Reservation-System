import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../services/api";
import '../../assets/css/ClientDashboard/BookingHistory.css'

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState("all");
    const [filteredBookings, setFilteredBookings] = useState([]);

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/reservations');
                const data = response.data.map((booking) => ({
                    id: booking.reservationCode, // Mã đặt chỗ
                    flightCode: booking.flightId, // Mã chuyến bay
                    from: "Placeholder From", // Placeholder nếu không có dữ liệu "From" từ API
                    to: "Placeholder To", // Placeholder nếu không có dữ liệu "To" từ API
                    date: booking.travelDate, // Ngày đi
                    price: booking.totalPrice, // Tổng giá
                    paymentStatus: booking.reservationStatus === "Paid", // Kiểm tra trạng thái thanh toán
                }));
                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings: ", error);
            }
        };

        fetchBookings();
    }, []);

    // Lọc danh sách bookings theo filter
    useEffect(() => {
        if (filter === "all") {
            setFilteredBookings(bookings);
        } else if (filter === "paid") {
            setFilteredBookings(bookings.filter((booking) => booking.paymentStatus));
        } else if (filter === "pending") {
            setFilteredBookings(bookings.filter((booking) => !booking.paymentStatus));
        }
    }, [filter, bookings]);

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
