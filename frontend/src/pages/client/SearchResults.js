import React, { useEffect, useState } from "react";
import { useQueryParams } from "../../hook/useQueryParams"; // Đường dẫn theo cấu trúc dự án
import { searchFlights } from "../../services/clientApi";
import { useNavigate } from "react-router-dom"; // Điều hướng

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

  const handleFlightSelect = (flight) => {
    // Chỉ lưu FlightId
    localStorage.setItem("selectedFlightId", flight.flightId);
    navigate("/customerdetail");
};

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Search Results</h1>
            {flights.length > 0 ? (
                <div>
                    {flights.map((flight) => (
                        <div
                            key={flight.flightId}
                            onClick={() => handleFlightSelect(flight)}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                margin: "8px 0",
                                padding: "16px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                backgroundColor: "#f9f9f9",
                                transition: "background-color 0.3s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                        >
                            <div>
                                <p>
                                    <strong>Flight Number:</strong> {flight.flightNumber}
                                </p>
                                <p>
                                    <strong>Departure Time:</strong> {new Date(flight.departureTime).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <strong>Price:</strong> ${flight.dynamicPrice}
                                </p>
                                <p>
                                    <strong>Available Seats:</strong> {flight.availableSeats}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No flights available.</p>
            )}
        </div>
    );
};

export default SearchResults;
