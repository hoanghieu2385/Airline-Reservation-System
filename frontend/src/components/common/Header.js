import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/Header.css";
import Logo from "../../assets/images/Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const location = useLocation();
    const isIndexPage = location.pathname === "/";
    const navigate = useNavigate();
    const userEmail = sessionStorage.getItem("userEmail");
    const userRole = sessionStorage.getItem("userRole"); // Lấy role từ sessionStorage

    const getDisplayName = (email, role) => {
        if (role === "ADMIN") return "Admin";
        if (role === "CLERK") return "Clerk";
        if (!email.includes("@")) return email;
        return email.split("@")[0]; // Mặc định lấy phần trước '@'
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    const navigateToDashboard = () => {
        if (userRole === "ADMIN") {
            navigate("/admin");
        } else if (userRole === "CLERK") {
            navigate("/clerk");
        } else {
            navigate("/user/dashboard");
        }
    };

    useEffect(() => {
        let lastScrollY = 0;
        let ticking = false;

        const handleScroll = () => {
            lastScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(lastScrollY > 50);
                    ticking = false;
                });

                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`header-container ${isScrolled ? "scrolled" : ""} ${isIndexPage ? "overlay" : ""}`}
        >
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container">
                    <a className="navbar-brand" href="/">
                        <img src={Logo} alt="Logo" className="header-logo" />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto header-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/">
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/about">
                                    About
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/contact">
                                    Contact
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="/policies"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Policies
                                </a>
                            </li>
                        </ul>
                        <ul className="navbar-nav ms-auto header-nav">
                            {!userEmail ? (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/login">
                                            Login
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/register">
                                            Register
                                        </a>
                                    </li>
                                </>
                            ) : (
                                <li
                                    className="nav-item dropdown"
                                    onMouseEnter={() => setDropdownVisible(true)}
                                    onMouseLeave={() => setDropdownVisible(false)}
                                >
                                    <span className="nav-link">
                                        Hi, {getDisplayName(userEmail, userRole)}
                                        <FontAwesomeIcon icon={faUser} className="user-icon" />
                                    </span>
                                    {isDropdownVisible && (
                                        <ul className="dropdown-menu">
                                            <li
                                                className="dropdown-item"
                                                onClick={navigateToDashboard}
                                            >
                                                {userRole === "ADMIN"
                                                    ? "Admin Dashboard"
                                                    : userRole === "CLERK"
                                                    ? "Clerk Dashboard"
                                                    : "User Profile"}
                                            </li>
                                            <li className="dropdown-item" onClick={handleLogout}>
                                                Logout
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;