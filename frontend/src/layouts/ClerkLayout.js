import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/Admin/AdminLayout.css";

const ClerkLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    // check login session
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {

            navigate("/login");
        }
    }, [navigate]);

    // Logout
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userEmail");
        sessionStorage.clear();

        navigate("/login");
    };

    return (
        <div className="admin-layout">
            <header className="header">
                <h1>Clerk Dashboard</h1>
            </header>
            <div className="layout-container">
                <aside className="sider">
                    <nav>
                        <ul className="menu">
                            <li className="menu-item">
                                <Link to="/clerk" className={`menu-link ${isActive("/clerk")}`}>
                                    Dashboard
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/clerk/clerk_flights" className={`menu-link ${isActive("/clerk/airlines")}`}>
                                    Flight
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/clerk/clerk_airlines" className={`menu-link ${isActive("/clerk/airlines")}`}>
                                Airlines
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/clerk/clerk_airport" className={`menu-link ${isActive("/clerk/airlines")}`}>
                                Airport
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/clerk/clerk_client" className={`menu-link ${isActive("/clerk/clerk_client")}`}>
                                Client
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/clerk/clerk_profile" className={`menu-link ${isActive("/clerk/clerk_profile")}`}>
                                Profile
                                </Link>
                            </li>
                            <li className="menu-item">
                                <Link to="/clerk/clerk_security" className={`menu-link ${isActive("/clerk/clerk_security")}`}>
                                Change Password
                                </Link>
                            </li>
                            <li className="menu-item">
                                <button className="menu-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>
                <main className="content">{children}</main>
            </div>
        </div>
    );
};

export default ClerkLayout;
