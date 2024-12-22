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
    const [fromCode, setFromCode] = useState('');
    const [toCode, setToCode] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [passengers, setPassengers] = useState(1);
    const [seatClass, setSeatClass] = useState('Economy');
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
        if (!fromCode || !toCode) {
            alert("Please select valid airports for both 'From' and 'To'.");
            return;
        }
    
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
    
        const params = new URLSearchParams({
            from: fromCode.toUpperCase(), // Chuyển UUID sang chữ hoa
            to: toCode.toUpperCase(),    // Chuyển UUID sang chữ hoa
            date: departureDate ? formatDate(departureDate) : '',
            passengers: passengers.toString(),
            seatClass: seatClass,        // Sửa từ `class` thành `seatClass`
        });
    
        const searchUrl = `/results?${params.toString()}`;
        navigate(searchUrl);
    };

    const handleAirportSelection = (airport, setterQuery, setterCode, setFilteredAirports) => {
        setterQuery(`${airport.airportName} (${airport.airportCode})`);
        setterCode(airport.airportId); // Lưu UUID của sân bay vào trạng thái
        setFilteredAirports([]);
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
                                onClick={() => handleAirportSelection(airport, setFromQuery, setFromCode, setFilteredFromAirports)}
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
                                onClick={() => handleAirportSelection(airport, setToQuery, setToCode, setFilteredToAirports)}
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

            {/* Passengers and Class */}
            <div className="form-group" ref={passengersDropdownRef}>
                <label className="pcs-label" htmlFor="passengers">Passengers / Class</label>
                <div className="pcs-input-wrapper" onClick={() => setIsPassengerDropdownOpen(!isPassengerDropdownOpen)}>
                    <input
                        type="text"
                        id="passengers"
                        className="pcs-input"
                        value={`${passengers} Passenger${passengers > 1 ? 's' : ''} (${seatClass})`}
                        readOnly
                    />
                </div>
                {isPassengerDropdownOpen && (
                    <div className="pcs-dropdown">
                        <div className="pcs-dropdown__row">
                            <span className="pcs-dropdown__label">Passengers:</span>
                            <div className="pcs-dropdown__controls">
                                <button
                                    className="pcs-dropdown__btn"
                                    onClick={decrementPassengers}
                                    disabled={passengers <= 1}
                                >
                                    -
                                </button>
                                <span className="pcs-dropdown__count">{passengers}</span>
                                <button
                                    className="pcs-dropdown__btn"
                                    onClick={incrementPassengers}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="pcs-dropdown__class-section">
                            <span className="pcs-dropdown__label">Class:</span>
                            <div className="pcs-dropdown__class-options">
                                <label>
                                    <input
                                        type="radio"
                                        name="seatClass"
                                        value="Economy"
                                        checked={seatClass === 'Economy'}
                                        onChange={() => setSeatClass('Economy')}
                                    />
                                    Economy
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="seatClass"
                                        value="Premium"
                                        checked={seatClass === 'Premium'}
                                        onChange={() => setSeatClass('Premium')}
                                    />
                                    Premium
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsPassengerDropdownOpen(false)}
                        >
                            Confirm
                        </button>
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
