import React, { useEffect, useState } from "react";
import {
    getFlights,
    getAirlines,
    getAirports,
} from "../../services/clerkApi";

const FlightManagement = () => {
    const [flights, setFlights] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [airports, setAirports] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [showCompleted, setShowCompleted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const flightsPerPage = 15;

    useEffect(() => {
        fetchFlights();
        fetchAirlines();
        fetchAirports();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await getFlights();
            setFlights(response.data || []);
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    const fetchAirlines = async () => {
        try {
            const response = await getAirlines();
            setAirlines(response.data || []);
        } catch (error) {
            console.error("Error fetching airlines:", error);
        }
    };

    const fetchAirports = async () => {
        try {
            const response = await getAirports();
            setAirports(response.data || []);
        } catch (error) {
            console.error("Error fetching airports:", error);
        }
    };

    // Filter and sort flights
    const filteredFlights = flights
        .filter((flight) =>
            (flight.flightNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                flight.airlineName.toLowerCase().includes(searchText.toLowerCase()) ||
                flight.originAirportName.toLowerCase().includes(searchText.toLowerCase()) ||
                flight.destinationAirportName.toLowerCase().includes(searchText.toLowerCase())) &&
            (showCompleted || flight.status !== "COMPLETED")
        )
        .sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));

    // Pagination logic
    const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);
    const paginatedFlights = filteredFlights.slice(
        (currentPage - 1) * flightsPerPage,
        currentPage * flightsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flight-management__container mt-4">
            <h2>Flight Management</h2>

            {/* Search Bar */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control flight-management__search-input"
                    placeholder="Search by flight number, airline, origin, destination..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {/* Show Completed Checkbox */}
            <div className="mb-3">
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input flight-management__checkbox"
                        id="showCompleted"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="showCompleted">
                        Show Completed Flights
                    </label>
                </div>
            </div>

            {/* Flights Table */}
            <div className="table-responsive">
                <table className="table table-striped flight-management__table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Flight Number</th>
                            <th>Airline</th>
                            <th>Origin</th>
                            <th>Destination</th>
                            <th>Departure</th>
                            <th>Arrival</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedFlights.map((flight, index) => (
                            <tr key={flight.flightId}>
                                <td>{(currentPage - 1) * flightsPerPage + index + 1}</td>
                                <td>{flight.flightNumber}</td>
                                <td>{flight.airlineName}</td>
                                <td>{flight.originAirportName}</td>
                                <td>{flight.destinationAirportName}</td>
                                <td>{new Date(flight.departureTime).toLocaleString()}</td>
                                <td>{new Date(flight.arrivalTime).toLocaleString()}</td>
                                <td>{flight.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    className="btn btn-primary flight-management__prev-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="btn btn-primary flight-management__next-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default FlightManagement;
