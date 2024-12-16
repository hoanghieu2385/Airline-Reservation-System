import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/ClientDashboard.css";

const FlightDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const userProfile = sessionStorage.getItem("userProfile");
        if (!userProfile || !JSON.parse(userProfile).email) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const profile = sessionStorage.getItem("userProfile");
        if (profile) {
            setUserProfile(JSON.parse(profile));
        }
    }, []);

    const bookings = [
        {
            id: 1,
            flightCode: "FL1234",
            from: "New York (JFK)",
            to: "Los Angeles (LAX)",
            date: "2024-12-25",
            price: 350,
            paymentStatus: true,
        },
        {
            id: 2,
            flightCode: "FL5678",
            from: "Chicago (ORD)",
            to: "Miami (MIA)",
            date: "2024-11-15",
            price: 200,
            paymentStatus: false,
        },
        {
            id: 3,
            flightCode: "FL9101",
            from: "San Francisco (SFO)",
            to: "Seattle (SEA)",
            date: "2024-10-20",
            price: 150,
            paymentStatus: true,
        },
    ];

    if (!userProfile) {
        return (
            <div className="flight-dashboard__loader">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flight-dashboard">
            <div className="flight-dashboard__container">
                <nav className="flight-dashboard__sidebar">
                    <div className="flight-dashboard__sidebar-content">
                        <ul className="flight-dashboard__nav">
                            <li className="flight-dashboard__nav-item">
                                <button
                                    className={`flight-dashboard__nav-link ${activeTab === "profile" ? "active" : ""}`}
                                    onClick={() => setActiveTab("profile")}
                                >
                                    Profile
                                </button>
                            </li>
                            <li className="flight-dashboard__nav-item">
                                <button
                                    className={`flight-dashboard__nav-link ${activeTab === "history" ? "active" : ""}`}
                                    onClick={() => setActiveTab("history")}
                                >
                                    Booking History
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main className="flight-dashboard__main">
                    <div className="flight-dashboard__content">
                        {activeTab === "profile" && <UserProfile profile={userProfile} />}
                        {activeTab === "history" && <BookingHistory bookings={bookings} />}
                    </div>
                </main>
            </div>
        </div>
    );
};

const UserProfile = ({ profile }) => {
    return (
        <div className="flight-profile">
            <div className="flight-profile__header">
                <h2 className="flight-profile__title">My Profile</h2>
            </div>
            <div className="flight-profile__content">
                <div className="flight-profile__row">
                    <div className="flight-profile__field">
                        <label className="flight-profile__label">Full Name</label>
                        <p className="flight-profile__value">
                            {profile.firstName} {profile.lastName}
                        </p>
                    </div>
                    <div className="flight-profile__field">
                        <label className="flight-profile__label">Email</label>
                        <p className="flight-profile__value">{profile.email}</p>
                    </div>
                </div>
                <div className="flight-profile__row">
                    <div className="flight-profile__field">
                        <label className="flight-profile__label">Phone</label>
                        <p className="flight-profile__value">
                            {profile.phone || "Not provided"}
                        </p>
                    </div>
                    <div className="flight-profile__field">
                        <label className="flight-profile__label">Address</label>
                        <p className="flight-profile__value">
                            {profile.address || "Not provided"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
                                        <span className={`flight-booking__status ${booking.paymentStatus ? "paid" : "pending"}`}>
                                            {booking.paymentStatus ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="flight-booking__action-btn"
                                            onClick={() => viewDetails(booking.id)}
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

const viewDetails = (bookingId) => {
    alert(`Showing details for booking ID: ${bookingId}`);
};

export default FlightDashboard;