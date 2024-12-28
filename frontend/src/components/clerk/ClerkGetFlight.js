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

    const filteredFlights = flights.filter(
        (flight) =>
            flight.flightNumber.toLowerCase().includes(searchText.toLowerCase()) ||
            flight.airlineName.toLowerCase().includes(searchText.toLowerCase()) ||
            flight.originAirportName.toLowerCase().includes(searchText.toLowerCase()) ||
            flight.destinationAirportName.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="flight-management__container mt-4">
            <h2>Flight Management</h2>

            {/* Search Bar */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by flight number, airline, origin, destination..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {/* Flights Table */}
            <div className="table-responsive">
                <table className="table table-striped">
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
                        {filteredFlights.map((flight, index) => (
                            <tr key={flight.flightId}>
                                <td>{index + 1}</td>
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
        </div>
    );
};

export default FlightManagement;
