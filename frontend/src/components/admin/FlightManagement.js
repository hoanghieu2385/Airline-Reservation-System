import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import {
    getFlights,
    getAirlines,
    getAirports,
    createFlight,
    updateFlight,
    deleteFlight,
} from "../../services/adminApi";
import {notifyWarning, notifySuccess, notifyError } from "../../utils/notification";

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
    const [actionError, setActionError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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
            if (editingFlight) {
                // Chỉ validate các trường có thể edit khi đang update
                if (!form.departureTime || !form.arrivalTime || !form.status) {
                    notifyWarning("Please fill in all required fields");
                    return;
                }

                // Validate departure và arrival times
                const departureTime = new Date(form.departureTime);
                const arrivalTime = new Date(form.arrivalTime);
                if (departureTime >= arrivalTime) {
                    notifyWarning("Departure time must be before arrival time");
                    return;
                }

                // Update existing flight
                await updateFlight(editingFlight.flightId, {
                    departureTime: new Date(form.departureTime).toISOString(),
                    arrivalTime: new Date(form.arrivalTime).toISOString(),
                    status: form.status
                });

                notifySuccess("Flight updated successfully!");
            } else {
                // Validate tất cả các trường khi tạo mới
                if (!form.flightNumber || !form.airlineId || !form.originAirportId ||
                    !form.destinationAirportId || !form.departureTime || !form.arrivalTime ||
                    !form.duration || !form.totalSeats || !form.basePrice) {
                        notifyWarning("Please fill in all required fields");
                    return;
                }

                // Validate departure và arrival times
                const departureTime = new Date(form.departureTime);
                const arrivalTime = new Date(form.arrivalTime);
                if (departureTime >= arrivalTime) {
                    notifyWarning("Departure time must be before arrival time");
                    return;
                }

                // Validate total seats allocation
                const totalAllocatedSeats = form.seatAllocations.reduce(
                    (sum, allocation) => sum + (parseInt(allocation.availableSeats) || 0),
                    0
                );

                if (totalAllocatedSeats !== parseInt(form.totalSeats)) {
                    notifyWarning(`Total allocated seats (${totalAllocatedSeats}) must match total seats (${form.totalSeats})`);
                    return;
                }

                // Validate seat allocations
                for (const allocation of form.seatAllocations) {
                    if (!allocation.className || !allocation.availableSeats) {
                        notifyWarning("Please fill in all seat allocation details");
                        return;
                    }
                }

                // Create new flight
                const payload = {
                    flightNumber: form.flightNumber,
                    airlineId: form.airlineId,
                    originAirportId: form.originAirportId,
                    destinationAirportId: form.destinationAirportId,
                    departureTime: new Date(form.departureTime).toISOString(),
                    arrivalTime: new Date(form.arrivalTime).toISOString(),
                    duration: parseInt(form.duration),
                    totalSeats: parseInt(form.totalSeats),
                    basePrice: parseFloat(form.basePrice),
                    status: form.status,
                    seatAllocations: form.seatAllocations.map(allocation => ({
                        className: allocation.className,
                        availableSeats: parseInt(allocation.availableSeats)
                    }))
                };

                await createFlight(payload);
                notifySuccess("Flight created successfully!");
            }

            // Close modal and refresh list
            setModalVisible(false);
            const response = await getFlights();
            setFlights(response.data || []);

            // Reset form
            setForm({
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
                seatAllocations: [{ className: "", availableSeats: null }]
            });
            setEditingFlight(null);

        } catch (error) {
            console.error("Error saving flight:", error);
            const errorMessage = error.response?.data || "Check console for details";
            notifyError(`Failed to save flight: ${errorMessage}`);
        }
    };

    const handleDelete = async (flightId) => {
        if (!flightId) {
            setActionError("Invalid flight ID. Cannot delete flight.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this flight? This action cannot be undone.")) {
            return;
        }

        setActionError(null);
        setSuccessMessage(null);

        try {
            const response = await deleteFlight(flightId);

            if (response.status === 403) {
                setActionError("You don't have permission to delete flights. Please contact your administrator.");
                return;
            }

            const flightsResponse = await getFlights();
            setFlights(flightsResponse.data || []);
            setSuccessMessage("Flight deleted successfully!");
        } catch (error) {
            console.error("Error deleting flight:", error);
            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        setActionError("You don't have permission to delete flights. Please contact your administrator.");
                        break;
                    case 401:
                        setActionError("Your session has expired. Please log in again.");
                        break;
                    case 404:
                        setActionError("Flight not found. It may have been already deleted.");
                        const refreshResponse = await getFlights();
                        setFlights(refreshResponse.data || []);
                        break;
                    default:
                        setActionError(`Error: ${error.response.data?.message || "Failed to delete flight"}`);
                }
            } else if (error.request) {
                setActionError("Network error. Please check your connection and try again.");
            } else {
                setActionError("An unexpected error occurred. Please try again later.");
            }
        }
    };


    useEffect(() => {
        if (actionError || successMessage) {
            const timer = setTimeout(() => {
                setActionError(null);
                setSuccessMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [actionError, successMessage]);

    const filteredFlights = flights.filter(
        (flight) =>
            flight.flightNumber.toLowerCase().includes(searchText.toLowerCase()) ||
            flight.airlineName.toLowerCase().includes(searchText.toLowerCase()) ||
            flight.originAirportName.toLowerCase().includes(searchText.toLowerCase()) ||
            flight.destinationAirportName.toLowerCase().includes(searchText.toLowerCase())
    );

    if (loading) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-4">{error}</div>;
    }

    return (
        <div className="flight-management__container mt-4">
            <h2>Flight Management</h2>

            {actionError && (
                <Alert variant="destructive" className="mb-3">
                    {actionError}
                </Alert>
            )}

            {successMessage && (
                <Alert variant="success" className="mb-3">
                    {successMessage}
                </Alert>
            )}

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
                    setActionError(null);
                    setSuccessMessage(null);
                    setForm({
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
                                    <td>
                                        <span className={`badge ${flight.status === 'ACTIVE' ? 'bg-success' :
                                            flight.status === 'DELAYED' ? 'bg-warning' :
                                                'bg-danger'
                                            }`}>
                                            {flight.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => {
                                                    setActionError(null);
                                                    setSuccessMessage(null);

                                                    // Tìm airline và airports tương ứng
                                                    const airline = airlines.find(a => a.airlineId === flight.airlineId);
                                                    const originAirport = airports.find(a => a.airportId === flight.originAirportId);
                                                    const destAirport = airports.find(a => a.airportId === flight.destinationAirportId);

                                                    setForm({
                                                        ...flight,
                                                        // Giữ lại các giá trị từ flight hiện tại
                                                        airlineName: airline?.airlineName || flight.airlineName,
                                                        originAirportName: originAirport?.airportName || flight.originAirportName,
                                                        destinationAirportName: destAirport?.airportName || flight.destinationAirportName,
                                                        departureTime: new Date(flight.departureTime)
                                                            .toISOString()
                                                            .slice(0, 16),
                                                        arrivalTime: new Date(flight.arrivalTime)
                                                            .toISOString()
                                                            .slice(0, 16),
                                                        seatAllocations: flight.seatAllocations || [
                                                            { className: "", availableSeats: null }
                                                        ],
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
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {modalVisible && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                                    <div className="row">
                                        <div className="col-md-6">
                                            {/* Flight Number field */}
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Flight Number"
                                                    value={form.flightNumber}
                                                    onChange={(e) => setForm({ ...form, flightNumber: e.target.value })}
                                                    disabled={!!editingFlight}
                                                    required
                                                />

                                                <label>Flight Number</label>
                                            </div>

                                            {/* Airline field */}
                                            <div className="form-floating mb-3">
                                                {editingFlight ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={form.airlineName}
                                                        disabled
                                                    />
                                                ) : (
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
                                                            <option
                                                                key={airline.airlineId}
                                                                value={airline.airlineId}
                                                            >
                                                                {airline.airlineName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                <label>Airline</label>
                                            </div>

                                            {/* Origin Airport field */}
                                            <div className="form-floating mb-3">
                                                {editingFlight ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={form.originAirportName}
                                                        disabled
                                                    />
                                                ) : (
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
                                                            <option
                                                                key={airport.airportId}
                                                                value={airport.airportId}
                                                            >
                                                                {airport.airportName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                <label>Origin Airport</label>
                                            </div>

                                            {/* Destination Airport field */}
                                            <div className="form-floating mb-3">
                                                {editingFlight ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={form.destinationAirportName}
                                                        disabled
                                                    />
                                                ) : (
                                                    <select
                                                        className="form-control"
                                                        value={form.destinationAirportId}
                                                        onChange={(e) =>
                                                            setForm({
                                                                ...form,
                                                                destinationAirportId: e.target.value,
                                                            })
                                                        }
                                                        required
                                                    >
                                                        <option value="">Select Destination Airport</option>
                                                        {airports.map((airport) => (
                                                            <option
                                                                key={airport.airportId}
                                                                value={airport.airportId}
                                                            >
                                                                {airport.airportName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                                <label>Destination Airport</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    value={form.departureTime}
                                                    onChange={(e) =>
                                                        setForm({ ...form, departureTime: e.target.value })
                                                    }
                                                    required
                                                />
                                                <label>Departure Time</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    value={form.arrivalTime}
                                                    onChange={(e) =>
                                                        setForm({ ...form, arrivalTime: e.target.value })
                                                    }
                                                    required
                                                />
                                                <label>Arrival Time</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4">
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
                                                    disabled={editingFlight}
                                                    required
                                                    min="0"
                                                />
                                                <label>Duration (minutes)</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Total Seats"
                                                    value={form.totalSeats || ""}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            totalSeats: parseInt(e.target.value, 10),
                                                        })
                                                    }
                                                    disabled={editingFlight}
                                                    required
                                                    min="0"
                                                />
                                                <label>Total Seats</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Base Price"
                                                    value={form.basePrice || ""}
                                                    onChange={(e) =>
                                                        setForm({
                                                            ...form,
                                                            basePrice: parseFloat(e.target.value),
                                                        })
                                                    }
                                                    disabled={editingFlight}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                />
                                                <label>Base Price</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
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
                                        </div>
                                    </div>

                                    {!editingFlight && (
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h5>Seat Allocations</h5>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() =>
                                                        setForm({
                                                            ...form,
                                                            seatAllocations: [
                                                                ...form.seatAllocations,
                                                                { className: "", availableSeats: null },
                                                            ],
                                                        })
                                                    }
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
                                                                setForm({
                                                                    ...form,
                                                                    seatAllocations: updatedAllocations,
                                                                });
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
                                                                updatedAllocations[index].availableSeats = parseInt(
                                                                    e.target.value,
                                                                    10
                                                                );
                                                                setForm({
                                                                    ...form,
                                                                    seatAllocations: updatedAllocations,
                                                                });
                                                            }}
                                                            placeholder="Available Seats"
                                                            required
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => {
                                                                const updatedAllocations = form.seatAllocations.filter(
                                                                    (_, i) => i !== index
                                                                );
                                                                setForm({
                                                                    ...form,
                                                                    seatAllocations: updatedAllocations,
                                                                });
                                                            }}
                                                            disabled={form.seatAllocations.length === 1}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setModalVisible(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success">
                                            {editingFlight ? "Update Flight" : "Add Flight"}
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