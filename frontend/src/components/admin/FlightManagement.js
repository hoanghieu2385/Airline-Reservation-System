import React, { useEffect, useState } from "react";
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [form, setForm] = useState({
        flightNumber: "",
        airlineId: "",
        originAirportId: "",
        destinationAirportId: "",
        departureTime: "",
        arrivalTime: "",
        duration: null,
        totalSeats: null,
        basePrice: null,
        status: "ACTIVE",
        seatAllocations: [{ className: "", availableSeats: null }],
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [editingFlight, setEditingFlight] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [flightsRes, airlinesRes, airportsRes] = await Promise.all([
                    getFlights(),
                    getAirlines(),
                    getAirports(),
                ]);
                setFlights(flightsRes.data || []);
                setAirlines(airlinesRes.data || []);
                setAirports(airportsRes.data || []);
            } catch (err) {
                setError(err.message || "Failed to fetch data");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                flightNumber: form.flightNumber,
                airlineId: form.airlineId,
                originAirportId: form.originAirportId,
                destinationAirportId: form.destinationAirportId,
                departureTime: form.departureTime,
                arrivalTime: form.arrivalTime,
                duration: form.duration,
                totalSeats: form.totalSeats,
                basePrice: form.basePrice,
                status: form.status,
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
            const response = await getFlights();
            setFlights(response.data || []);
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
            const response = await getFlights();
            setFlights(response.data || []);
        } catch (error) {
            console.error("Error deleting flight:", error);
            alert("Failed to delete flight");
        }
    };

    if (loading) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-4">{error}</div>;
    }

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

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by flight number, airline, origin, destination..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

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
                        status: "ACTIVE",
                        seatAllocations: [{ className: "", availableSeats: null }],
                    });
                    setEditingFlight(null);
                    setModalVisible(true);
                }}
            >
                Add Flight
            </button>

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
                        {filteredFlights.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center">No flights found</td>
                            </tr>
                        ) : (
                            filteredFlights.map((flight, index) => (
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
                                                setForm({
                                                    ...flight,
                                                    seatAllocations: flight.seatAllocations || [{ className: "", availableSeats: null }],
                                                });
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {modalVisible && (
                <div className="modal show d-block">
                    <div className="modal-dialog">
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
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Flight Number"
                                            value={form.flightNumber}
                                            onChange={(e) => setForm({ ...form, flightNumber: e.target.value })}
                                            required
                                        />
                                        <label>Flight Number</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-control"
                                            value={form.airlineId}
                                            onChange={(e) => setForm({ ...form, airlineId: e.target.value })}
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
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-control"
                                            value={form.originAirportId}
                                            onChange={(e) => setForm({ ...form, originAirportId: e.target.value })}
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
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-control"
                                            value={form.destinationAirportId}
                                            onChange={(e) => setForm({ ...form, destinationAirportId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Destination Airport</option>
                                            {airports.map((airport) => (
                                                <option key={airport.airportId} value={airport.airportId}>
                                                    {airport.airportName}
                                                </option>
                                            ))}
                                        </select>
                                        <label>Destination Airport</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={form.departureTime}
                                            onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                                            required
                                        />
                                        <label>Departure Time</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={form.arrivalTime}
                                            onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
                                            required
                                        />
                                        <label>Arrival Time</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Duration"
                                            value={form.duration || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    duration: e.target.value ? parseInt(e.target.value, 10) : null,
                                                })
                                            }
                                            required
                                        />
                                        <label>Duration (minutes)</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Total Seats"
                                            value={form.totalSeats || ""}
                                            onChange={(e) =>
                                                setForm({ ...form, totalSeats: parseInt(e.target.value, 10) })
                                            }
                                            required
                                        />
                                        <label>Total Seats</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Base Price"
                                            value={form.basePrice || ""}
                                            onChange={(e) =>
                                                setForm({ ...form, basePrice: parseFloat(e.target.value) })
                                            }
                                            required
                                        />
                                        <label>Base Price</label>
                                    </div>
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

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5>Seat Allocations</h5>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => setForm({
                                                    ...form,
                                                    seatAllocations: [...form.seatAllocations, { className: "", availableSeats: null }],
                                                })}
                                            >
                                                Add Seat Class
                                            </button>
                                        </div>

                                        {form.seatAllocations.map((allocation, index) => (
                                            <div key={index} className="row mb-2">
                                                <div className="col-md-5">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={allocation.className}
                                                        onChange={(e) => {
                                                            const updatedAllocations = [...form.seatAllocations];
                                                            updatedAllocations[index].className = e.target.value;
                                                            setForm({ ...form, seatAllocations: updatedAllocations });
                                                        }}
                                                        placeholder="Class Name"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-5">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={allocation.availableSeats || ""}
                                                        onChange={(e) => {
                                                            const updatedAllocations = [...form.seatAllocations];
                                                            updatedAllocations[index].availableSeats = parseInt(e.target.value, 10);
                                                            setForm({ ...form, seatAllocations: updatedAllocations });
                                                        }}
                                                        placeholder="Available Seats"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => {
                                                            const updatedAllocations = form.seatAllocations.filter(
                                                                (a, i) => i !== index
                                                            );
                                                            setForm({ ...form, seatAllocations: updatedAllocations });
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button type="submit" className="btn btn-success w-100">
                                        {editingFlight ? "Update Flight" : "Add Flight"}
                                    </button>
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