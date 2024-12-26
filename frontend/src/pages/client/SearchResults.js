import React, { useEffect, useState, useRef } from "react";
import { useQueryParams } from "../../hook/useQueryParams";
import { searchFlights } from "../../services/clientApi";
import { useNavigate } from "react-router-dom";
import "../../assets/css/SearchResults.css";

const SearchResults = () => {
    const queryParams = useQueryParams();
    const navigate = useNavigate();

    const from = queryParams.get("from");
    const to = queryParams.get("to");
    const date = queryParams.get("date");
    const passengers = queryParams.get("passengers");
    const seatClass = queryParams.get("seatClass");

    const [flights, setFlights] = useState([]);
    const [error, setError] = useState(null);
    const [filterPrice, setFilterPrice] = useState(1000);
    const [sortOption, setSortOption] = useState("priceAsc");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Check login state
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const modalRef = useRef(null);

    useEffect(() => {
        // Check login status
        const checkLoginStatus = () => {
            const token = sessionStorage.getItem("token");
            setIsLoggedIn(!!token); // Update login state
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const flights = await searchFlights({
                    from,
                    to,
                    date,
                    passengers,
                    seatClass,
                });
                setFlights(flights);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchFlights();
    }, [from, to, date, passengers, seatClass]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowLoginPopup(false); // Close popup if clicked outside
            }
        };

        if (showLoginPopup) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [showLoginPopup]);

    const handleFlightSelect = (flight) => {
        if (!isLoggedIn) {
            setShowLoginPopup(true); // Show login popup if not logged in
            return;
        }

        // Save selected flight details to sessionStorage
        sessionStorage.setItem(
            "selectedFlight",
            JSON.stringify({
                flightId: flight.flightId,
                seatClass: seatClass,
            })
        );
        navigate("/customerdetail");
    };

    const closeLoginPopup = () => setShowLoginPopup(false);

    const filteredFlights = flights.filter((flight) => flight.dynamicPrice <= filterPrice);

    const sortedFlights = [...filteredFlights].sort((a, b) => {
        if (sortOption === "priceAsc") return a.dynamicPrice - b.dynamicPrice;
        if (sortOption === "priceDesc") return b.dynamicPrice - a.dynamicPrice;
        if (sortOption === "timeAsc") return new Date(a.departureTime) - new Date(b.departureTime);
        if (sortOption === "timeDesc") return new Date(b.departureTime) - new Date(a.departureTime);
        return 0;
    });

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mt-4 search-results">
            <div className="row">
                <div className="col-md-4 sidebar">
                    <div className="filter-price mb-4">
                        <label htmlFor="filterPrice">Max Price: ${filterPrice}</label>
                        <input
                            type="range"
                            className="form-range"
                            id="filterPrice"
                            min="0"
                            max="1000"
                            step="50"
                            value={filterPrice}
                            onChange={(e) => setFilterPrice(Number(e.target.value))}
                        />
                    </div>
                    <div className="sort-dropdown">
                        <label htmlFor="sortOption" className="form-label">Sort by:</label>
                        <select
                            id="sortOption"
                            className="form-select"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                            <option value="timeAsc">Time: Earliest First</option>
                            <option value="timeDesc">Time: Latest First</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-8 main-content">
                    <h4>Choose flight: {sortedFlights.length} search results found</h4>
                    <div>
                        {sortedFlights.map((flight) => (
                            <div
                                key={flight.flightId}
                                onClick={() => handleFlightSelect(flight)}
                                className="flight-card mb-3 p-3 shadow-sm"
                                style={{ borderRadius: "8px", cursor: "pointer" }}
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="mb-1"><strong>{flight.airlineName}</strong></p>
                                        <p className="text-muted mb-0">
                                            {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {" "} - {" "}
                                            {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="mb-0 text-uppercase" style={{ fontWeight: "bold", fontSize: "14px" }}>
                                            {flight.originAirportCode} → {flight.destinationAirportCode}
                                        </p>
                                        <p className="text-muted" style={{ fontSize: "12px" }}>
                                            {new Date(flight.departureTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-end">
                                        <h5 className="mb-0"><strong>${flight.dynamicPrice}</strong></h5>
                                        <p className="text-muted mb-0">Seats: {flight.availableSeats}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showLoginPopup && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div ref={modalRef} className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Login Required</h5>
                                <button type="button" className="btn-close" onClick={closeLoginPopup}></button>
                            </div>
                            <div className="modal-body">
                                <p>You need to log in to book a flight. Please log in to continue.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => navigate("/login")}
                                >
                                    Log In
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeLoginPopup}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
