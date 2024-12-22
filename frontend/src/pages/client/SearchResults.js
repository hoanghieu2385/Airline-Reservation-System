import React, { useEffect, useState } from "react";
import { useQueryParams } from "../../hook/useQueryParams"; // Đường dẫn theo cấu trúc dự án
import { searchFlights } from "../../services/clientApi";

const SearchResults = () => {
    const queryParams = useQueryParams();

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

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Search Results</h1>
            {flights.length > 0 ? (
                <div>
                    {flights.map((flight) => (
                        <div key={flight.flightId}>
                            <p>Flight Number: {flight.flightNumber}</p>
                            <p>Departure Time: {new Date(flight.departureTime).toLocaleString()}</p>
                            <p>Price: ${flight.dynamicPrice}</p>
                            <p>Available Seats: {flight.availableSeats}</p>
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
