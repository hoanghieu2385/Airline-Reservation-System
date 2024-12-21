import React, { useState, useEffect } from 'react';
import '../../assets/css/SearchResult.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchResult = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState("recommended");
    const [filters, setFilters] = useState({ budget: null, stops: null });

    useEffect(() => {
        const mockFlights = [
            { flightId: 1, duration: "16h 45m", airline: "Hawaiian Airlines", departure: "7:00AM", arrival: "4:15PM", stops: "1 stop", layover: "2h 45m in HNL", price: 624 },
            { flightId: 2, duration: "18h 22m", airline: "Japan Airlines", departure: "7:35AM", arrival: "12:15PM", stops: "1 stop", layover: "50m in HKG", price: 663 },
            { flightId: 3, duration: "15h 45m", airline: "Delta", departure: "10:55AM", arrival: "8:15PM", stops: "Nonstop", layover: "", price: 839 },
        ];
        setTimeout(() => {
            setFlights(mockFlights);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        // Apply sorting logic here
    };

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
        // Apply filtering logic here
    };

    if (loading) return <div className="search-loading">Loading flights...</div>;

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Sidebar Filter */}
                <div className="col-md-3">
                    <div className="filters border rounded p-3">
                        <h4>Filter by</h4>
                        <div className="filter-group">
                            <label>Budget</label>
                            <select
                                className="form-select"
                                onChange={(e) => handleFilterChange("budget", e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="0-500">$0 - $500</option>
                                <option value="500-1000">$500 - $1000</option>
                                <option value="1000-2000">$1000 - $2000</option>
                            </select>
                        </div>
                        <div className="filter-group mt-3">
                            <label>Stops</label>
                            <select
                                className="form-select"
                                onChange={(e) => handleFilterChange("stops", e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="nonstop">Nonstop</option>
                                <option value="1">1 Stop</option>
                                <option value="2">2+ Stops</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9">
                    {/* Sort Options */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1>{`Search Results: ${flights.length} flights found`}</h1>
                        <div>
                            <label className="me-2">Sort by:</label>
                            <select
                                className="form-select d-inline-block w-auto"
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <option value="recommended">Recommended</option>
                                <option value="priceLowHigh">Price: Low to High</option>
                                <option value="priceHighLow">Price: High to Low</option>
                                <option value="duration">Duration</option>
                            </select>
                        </div>
                    </div>

                    {/* Flight Results */}
                    <div className="flight-results">
                        {flights.map((flight) => (
                            <div
                                key={flight.flightId}
                                className="flight-item d-flex align-items-center justify-content-between border rounded p-3 mb-2"
                            >
                                <div className="flight-logo">
                                    <img
                                        src={`https://loremflickr.com/200/200?random=1?text=${flight.airline[0]}`}
                                        alt={flight.airline}
                                        className="rounded-circle"
                                    />
                                </div>
                                <div className="flight-info">
                                    <p className="mb-0 text-muted">{flight.duration}</p>
                                    <p className="mb-0 airline-name">{flight.airline}</p>
                                </div>
                                <div className="flight-timing">
                                    <p className="mb-0">{flight.departure} - {flight.arrival}</p>
                                </div>
                                <div className="flight-stops">
                                    <p className="mb-0">{flight.stops}</p>
                                    {flight.layover && <p className="mb-0 text-muted">{flight.layover}</p>}
                                </div>
                                <div className="flight-price text-end">
                                    <p className="mb-0">${flight.price}</p>
                                    <p className="mb-0 text-muted">round trip</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
