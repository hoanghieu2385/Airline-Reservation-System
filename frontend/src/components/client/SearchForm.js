// src/components/client/SearchForm.js
import React, { useState, useRef, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/css/SearchForm.css';
import airportData from '../../assets/data/airports.json';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [filteredFromAirports, setFilteredFromAirports] = useState([]);
    const [filteredToAirports, setFilteredToAirports] = useState([]);
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [passengers, setPassengers] = useState(1);
    const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);
    const passengersDropdownRef = useRef(null);

    // Filter airports based on query
    const handleAirportSearch = (query, setFilteredAirports) => {
        const filtered = airportData.filter(
            (airport) =>
                airport.name.toLowerCase().includes(query.toLowerCase()) ||
                airport.code.toLowerCase().includes(query.toLowerCase()) &&
            `${airport.name} (${airport.code})` !== query
        );
        setFilteredAirports(filtered);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close passengers dropdown
            if (
                passengersDropdownRef.current &&
                !passengersDropdownRef.current.contains(event.target)
            ) {
                setIsPassengerDropdownOpen(false);
            }
            // Close suggestions for "From" input
            if (
                fromInputRef.current &&
                !fromInputRef.current.contains(event.target)
            ) {
                setFilteredFromAirports([]);
            }
            // Close suggestions for "To" input
            if (
                toInputRef.current &&
                !toInputRef.current.contains(event.target)
            ) {
                setFilteredToAirports([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle passenger increment and decrement
    const incrementPassengers = () => {
        setPassengers((prev) => Math.min(prev + 1, 10));
    };

    const decrementPassengers = () => {
        setPassengers((prev) => Math.max(prev - 1, 1));
    };

    // Handle search button click
    const handleSearch = () => {
        navigate('/results', {
            state: {
                fromQuery,
                toQuery,
                departureDate,
                returnDate,
                passengers,
            },
        });
    };

    return (
        <div className="search-form">
            {/* From Field */}
            <div className="form-group" ref={fromInputRef}>
                <label htmlFor="from">From</label>
                <input
                    type="text"
                    id="from"
                    placeholder="Choose departure city"
                    value={fromQuery}
                    onChange={(e) => {
                        setFromQuery(e.target.value);
                        handleAirportSearch(e.target.value, setFilteredFromAirports);
                    }}
                />
                {filteredFromAirports.length > 0 && (
                    <ul className="suggestions">
                        {filteredFromAirports.map((airport) => (
                            <li
                                key={airport.code}
                                onClick={() => {
                                    setFromQuery(`${airport.name} (${airport.code})`);
                                    setFilteredFromAirports([]);
                                }}
                            >
                                {airport.name} ({airport.code})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* To Field */}
            <div className="form-group" ref={toInputRef}>
                <label htmlFor="to">To</label>
                <input
                    type="text"
                    id="to"
                    placeholder="Choose destination"
                    value={toQuery}
                    onChange={(e) => {
                        setToQuery(e.target.value);
                        handleAirportSearch(e.target.value, setFilteredToAirports);
                    }}
                />
                {filteredToAirports.length > 0 && (
                    <ul className="suggestions">
                        {filteredToAirports.map((airport) => (
                            <li
                                key={airport.code}
                                onClick={() => {
                                    setToQuery(`${airport.name} (${airport.code})`);
                                    setFilteredToAirports([]);
                                }}
                            >
                                {airport.name} ({airport.code})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Departure Date */}
            <div className="form-group">
                <label htmlFor="departureDate">Departure Date</label>
                <ReactDatePicker
                    selected={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Choose departure date"
                />
            </div>

            {/* Return Date */}
            <div className="form-group">
                <label htmlFor="returnDate">Return Date</label>
                <ReactDatePicker
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Choose return date"
                />
            </div>

            {/* Passengers */}
            <div className="form-group" ref={passengersDropdownRef}>
                <label htmlFor="passengers">Passengers</label>
                <input
                    type="text"
                    id="passengers"
                    value={`${passengers} Passenger${passengers > 1 ? 's' : ''}`}
                    readOnly
                    onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}
                />
                {isPassengerDropdownOpen && (
                    <div className="passenger-dropdown">
                        <button onClick={decrementPassengers}>-</button>
                        <span>{passengers}</span>
                        <button onClick={incrementPassengers}>+</button>
                    </div>
                )}
            </div>

            {/* Search Button */}
            <button className="search-button" onClick={handleSearch}>
                Search Flights
            </button>
        </div>
    );
};

export default SearchForm;
