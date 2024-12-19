import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/ClientDashboard/ClientDashboard.css";
import UserProfile from "../../components/client/ClientProfile";
import BookingHistory from "../../components/client/BookingHistory";
import Security from "../../components/client//Security";
import "../../services/clientApi"

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
                    <ul className="flight-dashboard__nav">
                        <li>
                            <button
                                className={`flight-dashboard__nav-link ${
                                    activeTab === "profile" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("profile")}
                            >
                                Profile
                            </button>
                        </li>
                        <li>
                            <button
                                className={`flight-dashboard__nav-link ${
                                    activeTab === "history" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("history")}
                            >
                                Bookings
                            </button>
                        </li>
                        <li>
                            <button
                                className={`flight-dashboard__nav-link ${
                                    activeTab === "security" ? "active" : ""
                                }`}
                                onClick={() => setActiveTab("security")}
                            >
                                Security
                            </button>
                        </li>
                    </ul>
                </nav>

                <main className="flight-dashboard__main">
                    <div className="flight-dashboard__content">
                        {activeTab === "profile" && <UserProfile profile={userProfile} />}
                        {activeTab === "history" && <BookingHistory bookings={bookings} />}
                        {activeTab === "security" && <Security userId={userProfile.id} />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FlightDashboard;
