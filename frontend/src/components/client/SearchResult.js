import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { searchFlights } from '../../services/clientApi';
import '../../assets/css/ResultsPage.css';

const ResultsPage = () => {
    const location = useLocation();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoize searchParams to avoid unnecessary re-renders
    const searchParams = useMemo(() => {
        const queryParams = new URLSearchParams(location.search);
        return {
            from: queryParams.get('from'),
            to: queryParams.get('to'),
            date: queryParams.get('date'),
            passengers: parseInt(queryParams.get('passengers'), 10),
            seatClass: queryParams.get('class'),
        };
    }, [location.search]);

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            try {
                const response = await searchFlights(searchParams);
                setFlights(response);
            } catch (err) {
                console.error('Error fetching flights:', err);
                setError(err.message || 'Failed to fetch flight data.');
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams]);

    if (loading) {
        return <div className="results-loading">Loading flights...</div>;
    }

    if (error) {
        return <div className="results-error">{error}</div>;
    }

    return (
        <div className="results-page">
            <h1>Search Results</h1>
            {flights.length === 0 ? (
                <p>No flights found for your search criteria.</p>
            ) : (
                <ul className="results-list">
                    {flights.map((flight) => (
                        <li key={flight.flightId} className="flight-card">
                            <h2>{flight.flightNumber}</h2>
                            <p>
                                <strong>Departure:</strong>{' '}
                                {new Date(flight.departureTime).toLocaleString()}
                            </p>
                            <p>
                                <strong>Price:</strong> ${flight.dynamicPrice.toFixed(2)}
                            </p>
                            <p>
                                <strong>Class:</strong> {flight.seatClass}
                            </p>
                            <p>
                                <strong>Available Seats:</strong> {flight.availableSeats}
                            </p>
                            <button className="book-flight-button">Book Now</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResultsPage;
