// src/components/client/SearchForm.js
import React, { useState, useRef, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchAirports } from '../../services/clientApi';
import { debounce } from 'lodash';
import '../../assets/css/SearchForm.css';

const SearchForm = () => {
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [passengers, setPassengers] = useState(1);
    const [filteredFromAirports, setFilteredFromAirports] = useState([]);
    const [filteredToAirports, setFilteredToAirports] = useState([]);
    const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
    const [isLoadingFrom, setIsLoadingFrom] = useState(false);
    const [isLoadingTo, setIsLoadingTo] = useState(false);

    const navigate = useNavigate();
    const passengersDropdownRef = useRef();

    const handleAirportSearch = useRef(
        debounce(async (query, setFilteredAirports, setIsLoading, excludeAirportCode = null) => {
            if (!query.trim()) {
                setFilteredAirports([]);
                return;
            }
            setIsLoading(true);
            try {
                const airports = await searchAirports(query);
                const filteredAirports = excludeAirportCode
                    ? airports.filter(airport => airport.airportCode !== excludeAirportCode)
                    : airports;
                setFilteredAirports(filteredAirports);
            } catch (error) {
                console.error('Error fetching airports:', error);
                setFilteredAirports([]);
            } finally {
                setIsLoading(false);
            }
        }, 300)
    ).current;
    

    useEffect(() => {
        return () => {
            handleAirportSearch.cancel();
        };
    }, []);

    const incrementPassengers = () => {
        setPassengers((prev) => Math.min(prev + 1, 10));
    };

    const decrementPassengers = () => {
        setPassengers((prev) => Math.max(prev - 1, 1));
    };

    const clearInput = (setter, setFilteredAirports) => {
        setter('');
        setFilteredAirports([]);
    };

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
            <div className="form-group">
                <label htmlFor="from">From</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="from"
                        placeholder="Choose departure city"
                        value={fromQuery}
                        onChange={(e) => {
                            setFromQuery(e.target.value);
                            handleAirportSearch(e.target.value, setFilteredFromAirports, setIsLoadingFrom);
                        }}
                        autoComplete="off"
                    />
                    {fromQuery && (
                        <button
                            className="clear-button"
                            onClick={() => clearInput(setFromQuery, setFilteredFromAirports)}
                            type="button"
                            aria-label="Clear departure city"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                {filteredFromAirports.length > 0 && (
                    <ul className="suggestions">
                        {filteredFromAirports.map((airport) => (
                            <li
                                key={airport.airportId}
                                onClick={() => {
                                    setFromQuery(`${airport.airportName} (${airport.airportCode})`);
                                    setFilteredFromAirports([]);
                                }}
                            >
                                {airport.airportName} ({airport.airportCode})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* To Field */}
            <div className="form-group">
                <label htmlFor="to">To</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        id="to"
                        placeholder="Choose destination"
                        value={toQuery}
                        onChange={(e) => {
                            setToQuery(e.target.value);
                            handleAirportSearch(e.target.value, setFilteredToAirports, setIsLoadingTo);
                        }}
                        autoComplete="off"
                    />
                    {toQuery && (
                        <button
                            className="clear-button"
                            onClick={() => clearInput(setToQuery, setFilteredToAirports)}
                            type="button"
                            aria-label="Clear destination"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                {filteredToAirports.length > 0 && (
                    <ul className="suggestions">
                        {filteredToAirports.map((airport) => (
                            <li
                                key={airport.airportId}
                                onClick={() => {
                                    setToQuery(`${airport.airportName} (${airport.airportCode})`);
                                    setFilteredToAirports([]);
                                }}
                            >
                                {airport.airportName} ({airport.airportCode})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Departure Date */}
            <div className="form-group">
                <label htmlFor="departureDate">Departure Date</label>
                <div className="input-wrapper">
                    <ReactDatePicker
                        id="departureDate"
                        selected={departureDate}
                        onChange={(date) => setDepartureDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Choose departure date"
                        minDate={new Date()}
                        autoComplete="off"
                    />
                    {departureDate && (
                        <button
                            className="clear-button"
                            onClick={() => setDepartureDate(null)}
                            type="button"
                            aria-label="Clear departure date"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Return Date */}
            <div className="form-group">
                <label htmlFor="returnDate">Return Date</label>
                <div className="input-wrapper">
                    <ReactDatePicker
                        id="returnDate"
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Choose return date"
                        minDate={departureDate || new Date()}
                        autoComplete="off"
                    />
                    {returnDate && (
                        <button
                            className="clear-button"
                            onClick={() => setReturnDate(null)}
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