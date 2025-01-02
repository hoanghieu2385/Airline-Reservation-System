import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/ClientDashboard/ClientDashboard.css";
import UserProfile from "../../components/client/ClientProfile";
import BookingHistory from "../../components/client/BookingHistory";
import Security from "../../components/client/Security";
import { getCurrentUser } from "../../services/clientApi";

const FlightDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy tab hiện tại từ URL hoặc mặc định là "profile"
    const currentTab = new URLSearchParams(location.search).get("tab") || "profile";

    const [activeTab, setActiveTab] = useState(currentTab);
    const [userProfile, setUserProfile] = useState(null);

    const bookings = [];

    // Check login status
    useEffect(() => {
        const userProfile = sessionStorage.getItem("userProfile");
        if (!userProfile || !JSON.parse(userProfile).email) {
            navigate("/login");
        }
    }, [navigate]);

    // Fetch user profile when activeTab changes to "profile"
    useEffect(() => {
        const fetchProfile = async () => {
            if (activeTab === "profile") {
                const profile = await getCurrentUser();
                setUserProfile(profile);
            }
        };
        fetchProfile();
    }, [activeTab]);

    useEffect(() => {
        navigate(`?tab=${activeTab}`, { replace: true });
    }, [activeTab, navigate]);

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
