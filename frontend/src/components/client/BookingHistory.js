import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/ClientDashboard/BookingHistory.css";

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
        const authToken = sessionStorage.getItem("authToken");
    
        console.log("userId:", userId);
        console.log("authToken:", authToken);
    
        if (!userId || !authToken) {
            alert("Session expired or invalid. Redirecting to login.");
            window.location.href = "/login"; // Redirect to login
            return;
        }
    
        fetchBookings({ id: userId, token: authToken });
    }, []);
    
    const fetchBookings = async (user) => {
        const userId = sessionStorage.getItem("userId") || user.id;
        const authToken = sessionStorage.getItem("authToken") || user.token;

        try {
            setLoading(true);
            const response = await axios.get(`/api/Reservations?userId=${userId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setBookings(response.data);
        } catch (err) {
            console.error("Error fetching bookings:", err.response || err.message);
            setError(
                err.response?.data || "An error occurred while loading bookings. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (reservationId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        try {
            await axios.put(
                `/api/Reservations/${reservationId}`,
                { reservationStatus: "Cancelled" },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            fetchBookings(user); // Refresh bookings
        } catch (err) {
            alert("Failed to cancel reservation. Please try again.");
        }
    };

    const handleConfirm = async (reservationId) => {
        const user = JSON.parse(localStorage.getItem("user"));
        try {
            await axios.put(
                `/api/Reservations/${reservationId}`,
                { reservationStatus: "Confirmed" },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            fetchBookings(user); // Refresh bookings
        } catch (err) {
            alert("Failed to confirm reservation. Please try again.");
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (filter === "all") return true;
        return booking.reservationStatus.toLowerCase() === filter;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flight-booking">
            <div className="flight-booking__header">
                <h2>Booking History</h2>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Bookings</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="blocked">Blocked</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="flight-booking__table-wrapper">
                <table className="flight-booking__table">
                    <thead>
                        <tr>
                            <th>Reservation Code</th>
                            <th>Travel Date</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Passengers</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking) => (
                            <tr key={booking.reservationId}>
                                <td>{booking.reservationCode}</td>
                                <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                                <td>${booking.totalPrice}</td>
                                <td>
                                    <span className={`status ${booking.reservationStatus.toLowerCase()}`}>
                                        {booking.reservationStatus}
                                    </span>
                                </td>
                                <td>{booking.passengers?.length || 0}</td>
                                <td>
                                    {booking.reservationStatus === "Blocked" && (
                                        <>
                                            <button onClick={() => handleConfirm(booking.reservationId)}>
                                                Confirm
                                            </button>
                                            <button onClick={() => handleCancel(booking.reservationId)}>
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {booking.reservationStatus === "Confirmed" && (
                                        <button onClick={() => handleCancel(booking.reservationId)}>
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingHistory;
