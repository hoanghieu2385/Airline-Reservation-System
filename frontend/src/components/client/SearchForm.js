// src/components/client/SearchForm.js
import 'react-datepicker/dist/react-datepicker.css';
import '../../assets/css/SearchForm.css';
import airportData from '../../assets/data/airports.json';

import React, { useState, useRef, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

const SearchForm = () => {
    // Form field states
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [passengers, setPassengers] = useState(1);

    // UI state management
    const [filteredFromAirports, setFilteredFromAirports] = useState([]);
    const [filteredToAirports, setFilteredToAirports] = useState([]);
    const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);

    // Hover states for clear buttons
    const [fromHover, setFromHover] = useState(false);
    const [toHover, setToHover] = useState(false);
    const [departureDateHover, setDepartureDateHover] = useState(false);
    const [returnDateHover, setReturnDateHover] = useState(false);

    // Refs for handling clicks outside
    const fromInputRef = useRef(null);
    const toInputRef = useRef(null);
    const passengersDropdownRef = useRef(null);

    const navigate = useNavigate();

    // Handle airport search/filtering
    const handleAirportSearch = (query, setFilteredAirports) => {
        const filtered = airportData.filter(
            (airport) =>
                airport.name.toLowerCase().includes(query.toLowerCase()) ||
                airport.code.toLowerCase().includes(query.toLowerCase()) &&
                `${airport.name} (${airport.code})` !== query
        );
        setFilteredAirports(filtered);
    };

    // Clear button handlers
    const clearFrom = () => {
        setFromQuery('');
        setFilteredFromAirports([]);
    };

    const clearTo = () => {
        setToQuery('');
        setFilteredToAirports([]);
    };

    const clearDepartureDate = () => {
        setDepartureDate(null);
    };

    const clearReturnDate = () => {
        setReturnDate(null);
    };

    // Passenger count handlers
    const incrementPassengers = () => {
        setPassengers((prev) => Math.min(prev + 1, 10));
    };

    const decrementPassengers = () => {
        setPassengers((prev) => Math.max(prev - 1, 1));
    };

    // Handle search submission
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

    // Handle clicks outside dropdowns
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

    return (
        <div className="search-form">
            {/* From Field */}
            <div 
                className="form-group" 
                ref={fromInputRef}
                onMouseEnter={() => setFromHover(true)}
                onMouseLeave={() => setFromHover(false)}
            >
                <label htmlFor="from">From</label>
                <div className="input-wrapper">
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
                    {(fromQuery || fromHover) && (
                        <button 
                            className="clear-button"
                            onClick={clearFrom}
                            type="button"
                            aria-label="Clear from field"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
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
            <div 
                className="form-group" 
                ref={toInputRef}
                onMouseEnter={() => setToHover(true)}
                onMouseLeave={() => setToHover(false)}
            >
                <label htmlFor="to">To</label>
                <div className="input-wrapper">
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
                    {(toQuery || toHover) && (
                        <button 
                            className="clear-button"
                            onClick={clearTo}
                            type="button"
                            aria-label="Clear to field"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
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
            <div 
                className="form-group"
                onMouseEnter={() => setDepartureDateHover(true)}
                onMouseLeave={() => setDepartureDateHover(false)}
            >
                <label htmlFor="departureDate">Departure Date</label>
                <div className="input-wrapper">
                    <ReactDatePicker
                        id="departureDate"
                        selected={departureDate}
                        onChange={(date) => setDepartureDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Choose departure date"
                        minDate={new Date()}
                    />
                    {(departureDate || departureDateHover) && (
                        <button 
                            className="clear-button"
                            onClick={clearDepartureDate}
                            type="button"
                            aria-label="Clear departure date"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Return Date */}
            <div 
                className="form-group"
                onMouseEnter={() => setReturnDateHover(true)}
                onMouseLeave={() => setReturnDateHover(false)}
            >
                <label htmlFor="returnDate">Return Date</label>
                <div className="input-wrapper">
                    <ReactDatePicker
                        id="returnDate"
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Choose return date"
                        minDate={departureDate || new Date()}
                    />
                    {(returnDate || returnDateHover) && (
                        <button 
                            className="clear-button"
                            onClick={clearReturnDate}
                            type="button"
                            aria-label="Clear return date"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
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