import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    getFlights,
    getAirlines,
    getAirports,
    createFlight,
    updateFlight,
    deleteFlight,
} from "../../services/adminApi";

const FlightManagement = () => {
    const [flights, setFlights] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [airports, setAirports] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [form, setForm] = useState({
        flightNumber: "",
        airlineId: "",
        originAirportId: "",
        destinationAirportId: "",
        departureTime: "",
        arrivalTime: "",
        duration: 0,
        totalSeats: 0,
        basePrice: 0,
        status: "ACTIVE",
        seatAllocations: [
            { className: "Economy", availableSeats: 0 },
            { className: "Business", availableSeats: 0 },
            { className: "First Class", availableSeats: 0 },
        ],
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);

    useEffect(() => {
        fetchFlights();
        fetchAirlines();
        fetchAirports();
    }, []);

    const fetchFlights = async () => {
        try {
            const response = await getFlights();
            setFlights(response?.data || []);
        } catch (error) {
            console.error("Error fetching flights:", error);
            setFlights([]);
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

    const handleTimeChange = (field, value) => {
        const updatedForm = { ...form, [field]: value };
        if (field === "departureTime" || field === "arrivalTime") {
            const departure = new Date(updatedForm.departureTime);
            const arrival = new Date(updatedForm.arrivalTime);
            if (departure && arrival) {
                if (arrival > departure) {
                    updatedForm.duration = Math.round((arrival - departure) / (1000 * 60)); // Duration in minutes
                } else {
                    alert("Arrival time must be after departure time.");
                    updatedForm.duration = 0;
                }
            } else {
                updatedForm.duration = 0;
            }
        }
        setForm(updatedForm);
    };

    const handleSeatAllocationChange = (index, value) => {
        const updatedAllocations = [...form.seatAllocations];
        updatedAllocations[index].availableSeats = parseInt(value, 10) || 0;

        const totalSeats = updatedAllocations.reduce((sum, allocation) => sum + allocation.availableSeats, 0);

        setForm({ ...form, seatAllocations: updatedAllocations, totalSeats });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                seatAllocations: form.seatAllocations,
            };

            if (editingFlight) {
                await updateFlight(editingFlight.flightId, payload);
                alert("Flight updated successfully!");
            } else {
                await createFlight(payload);
                alert("Flight created successfully!");
            }

            setModalVisible(false);
            fetchFlights();
        } catch (error) {
            console.error("Error saving flight:", error);
            alert(`Failed to save flight: ${error.response?.data || "Check console for details"}`);
        }
    };

    const handleDelete = async (flightId) => {
        if (!window.confirm("Are you sure you want to delete this flight?")) return;
        try {
            await deleteFlight(flightId);
            alert("Flight deleted successfully!");
            fetchFlights();
        } catch (error) {
            console.error("Error deleting flight:", error);
        }
    };

    const filteredFlights = Array.isArray(flights)
        ? flights.filter((flight) =>
            ["flightNumber", "airlineName", "originAirportName", "destinationAirportName"]
                .some((key) =>
                    flight[key]?.toLowerCase()?.includes(searchText.toLowerCase())
                )
        )
        : [];

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

            {/* Add Flight Button */}
            <button
                className="btn btn-primary mb-3"
                onClick={() => {
                    setForm({
                        flightNumber: "",
                        airlineId: "",
                        originAirportId: "",
                        destinationAirportId: "",
                        departureTime: "",
                        arrivalTime: "",
                        duration: 0,
                        totalSeats: 0,
                        basePrice: 0,
                        status: "Active",
                    });
                    setEditingFlight(null);
                    setModalVisible(true);
                }}
            >
                Add Flight
            </button>

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
                            <th>Actions</th>
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
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => {
                                            setForm(flight);
                                            setEditingFlight(flight);
                                            setModalVisible(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(flight.flightId)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {modalVisible && (
                <div className="modal show d-block">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingFlight ? "Edit Flight" : "Add Flight"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setModalVisible(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit}>
                                    {/* Flight Number */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Flight Number"
                                            value={form.flightNumber}
                                            onChange={(e) =>
                                                setForm({ ...form, flightNumber: e.target.value })
                                            }
                                            required
                                        />
                                        <label>Flight Number</label>
                                    </div>
                                    {/* Airline */}
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-control"
                                            value={form.airlineId}
                                            onChange={(e) =>
                                                setForm({ ...form, airlineId: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">Select Airline</option>
                                            {airlines.map((airline) => (
                                                <option key={airline.airlineId} value={airline.airlineId}>
                                                    {airline.airlineName}
                                                </option>
                                            ))}
                                        </select>
                                        <label>Airline</label>
                                    </div>
                                    {/* Airports */}
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <select
                                                    className="form-control"
                                                    value={form.originAirportId}
                                                    onChange={(e) =>
                                                        setForm({ ...form, originAirportId: e.target.value })
                                                    }
                                                    required
                                                >
                                                    <option value="">Select Origin Airport</option>
                                                    {airports.map((airport) => (
                                                        <option key={airport.airportId} value={airport.airportId}>
                                                            {airport.airportName}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label>Origin Airport</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <select
                                                    className="form-control"
                                                    value={form.destinationAirportId}
                                                    onChange={(e) =>
                                                        setForm({ ...form, destinationAirportId: e.target.value })
                                                    }
                                                    required
                                                >
                                                    <option value="">Select Destination Airport</option>
                                                    {airports
                                                        .filter(
                                                            (airport) =>
                                                                airport.airportId !== form.originAirportId
                                                        )
                                                        .map((airport) => (
                                                            <option
                                                                key={airport.airportId}
                                                                value={airport.airportId}
                                                            >
                                                                {airport.airportName}
                                                            </option>
                                                        ))}
                                                </select>
                                                <label>Destination Airport</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Date Picker */}
                                    <div className="mb-3">
                                        <label>Departure and Arrival Times</label>
                                        <DatePicker
                                            selected={
                                                form.departureTime ? new Date(form.departureTime) : null
                                            }
                                            onChange={(dates) => {
                                                const [start, end] = dates;
                                                setForm({
                                                    ...form,
                                                    departureTime: start?.toISOString(),
                                                    arrivalTime: end?.toISOString(),
                                                    duration:
                                                        start && end
                                                            ? Math.round((end - start) / (1000 * 60))
                                                            : 0,
                                                });
                                            }}
                                            startDate={
                                                form.departureTime ? new Date(form.departureTime) : null
                                            }
                                            endDate={
                                                form.arrivalTime ? new Date(form.arrivalTime) : null
                                            }
                                            selectsRange
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            placeholderText="Select Departure and Arrival Times"
                                        />
                                    </div>
                                    {/* Base Price and Seats */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Base Price"
                                            value={form.basePrice}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    basePrice: parseFloat(e.target.value),
                                                })
                                            }
                                            required
                                        />
                                        <label>Base Price</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Total Seats"
                                            value={form.totalSeats}
                                            disabled
                                        />
                                        <label>Total Seats</label>
                                    </div>
                                    {/* Seat Allocations */}
                                    <div className="mb-3">
                                        <h5>Seat Allocations</h5>
                                        {form.seatAllocations.map((allocation, index) => (
                                            <div key={index} className="row mb-2">
                                                <div className="col-md-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={allocation.className}
                                                        disabled
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={allocation.availableSeats}
                                                        onChange={(e) =>
                                                            handleSeatAllocationChange(index, e.target.value)
                                                        }
                                                        placeholder="Available Seats"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Status */}
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-control"
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                            required
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="DELAYED">Delayed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                        <label>Status</label>
                                    </div>
                                    {/* Form Actions */}
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary">
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary ms-2"
                                            onClick={() => setModalVisible(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightManagement;
