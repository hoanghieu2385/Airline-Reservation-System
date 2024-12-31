import React, { useEffect, useState } from "react";
import {
    getFlightRoutes,
    addFlightRoute,
    updateFlightRoute,
    deleteFlightRoute,
    searchAirports,
} from "../../services/adminApi";
import { notifySuccess, notifyError } from "../../utils/notification";
import "../../assets/css/Admin/FlightRouteManagement.css";

const FlightRouteManagement = () => {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form, setForm] = useState({
        originAirportId: "",
        destinationAirportId: "",
        distance: "",
    });

    const [originAirportDisplay, setOriginAirportDisplay] = useState(""); // For displaying name and code
    const [destinationAirportDisplay, setDestinationAirportDisplay] = useState("");

    const [originAirportSuggestions, setOriginAirportSuggestions] = useState([]);
    const [destinationAirportSuggestions, setDestinationAirportSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    useEffect(() => {
        fetchFlightRoutes();
    }, []);

    const fetchFlightRoutes = async () => {
        try {
            const response = await getFlightRoutes();
            setData(response.data || []);
        } catch (error) {
            notifyError("Failed to fetch flight routes.");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!form.originAirportId || !form.destinationAirportId || !form.distance) {
            notifyError("All fields are required.");
            return;
        }

        if (form.distance <= 0) {
            notifyError("Distance must be greater than 0.");
            return;
        }

        const payload = {
            originAirportId: form.originAirportId,
            destinationAirportId: form.destinationAirportId,
            distance: form.distance,
        };

        try {
            if (editingRecord) {
                await updateFlightRoute(editingRecord.flightRouteId, payload);
                notifySuccess("Flight route updated successfully.");
            } else {
                await addFlightRoute(payload);
                notifySuccess("Flight route added successfully.");
            }
            setModalVisible(false);
            fetchFlightRoutes();
        } catch (error) {
            console.error("Error saving flight route:", error.response?.data);
            notifyError(
                error.response?.data?.title || "Failed to save flight route.",
            );
        }
    };


    const handleDelete = async (record) => {
        if (
            !window.confirm(
                `Are you sure you want to delete the flight route from ${record.originAirportId} to ${record.destinationAirportId}?`
            )
        )
            return;

        try {
            await deleteFlightRoute(record.flightRouteId);
            notifySuccess("Flight route deleted successfully.");
            fetchFlightRoutes();
        } catch (error) {
            notifyError("Failed to delete flight route.");
        }
    };

    const handleSearchAirport = async (query, field) => {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: query,
        }));

        if (query.trim() === "") {
            if (field === "originAirportId") setOriginAirportSuggestions([]);
            else setDestinationAirportSuggestions([]);
            return;
        }

        try {
            setLoadingSuggestions(true);
            const suggestions = await searchAirports(query);
            if (field === "originAirportId") {
                setOriginAirportSuggestions(suggestions || []);
            } else {
                setDestinationAirportSuggestions(suggestions || []);
            }
        } catch (error) {
            notifyError("Failed to fetch airport suggestions.");
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const handleSelectAirport = (airport, field) => {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: airport.airportId, // Store ID for API submission
        }));
    
        if (field === "originAirportId") {
            setOriginAirportDisplay(`${airport.airportName} (${airport.airportCode})`); // Display name (code)
            setOriginAirportSuggestions([]); // Clear suggestions
        } else {
            setDestinationAirportDisplay(`${airport.airportName} (${airport.airportCode})`); // Display name (code)
            setDestinationAirportSuggestions([]); // Clear suggestions
        }
    };    

    const filteredData = data.filter(
        (route) =>
            route.originAirportId.toLowerCase().includes(searchText.toLowerCase()) ||
            route.destinationAirportId.toLowerCase().includes(searchText.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRoutes = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="flight-route-mgmt-container mt-4">
            <h2>Flight Route Management</h2>

            {/* Search bar */}
            <div className="flight-route-mgmt-search mb-3">
                <input
                    type="text"
                    placeholder="Search by origin or destination airport ID..."
                    className="form-control"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            {/* Add flight route button */}
            <button
                className="btn btn-primary flight-route-mgmt-add-button mb-3"
                onClick={() => {
                    setForm({ originAirportId: "", destinationAirportId: "", distance: "" });
                    setEditingRecord(null);
                    setModalVisible(true);
                }}
            >
                Add Flight Route
            </button>

            {/* Flight routes table */}
            <table className="table table-striped flight-route-mgmt-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Origin Airport</th>
                        <th>Destination Airport</th>
                        <th>Distance (km)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRoutes.length > 0 ? (
                        currentRoutes.map((route, index) => (
                            <tr key={route.flightRouteId}>
                                <td>{index + 1}</td>
                                <td>{route.originAirport?.airportName || "N/A"}</td>
                                <td>{route.destinationAirport?.airportName || "N/A"}</td>
                                <td>{route.distance}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => {
                                            setForm({
                                                originAirportId: route.originAirportId,
                                                destinationAirportId: route.destinationAirportId,
                                                distance: route.distance,
                                            });
                                            setEditingRecord(route);
                                            setModalVisible(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(route)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No flight routes available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flight-route-mgmt-pagination d-flex justify-content-between align-items-center">
                <button
                    className="btn btn-outline-secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="btn btn-outline-secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>

            {/* Add/Edit modal */}
            {modalVisible && (
                <div className="modal show d-block flight-route-mgmt-modal" tabIndex="-1">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingRecord ? "Edit Flight Route" : "Add Flight Route"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setModalVisible(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleFormSubmit}>
                                    {/* Origin Airport */}
                                    <div className="form-floating mb-3 position-relative">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="floatingOriginAirportId"
                                            placeholder="Origin Airport"
                                            value={form.originAirportId}
                                            onChange={(e) =>
                                                handleSearchAirport(e.target.value, "originAirportId")
                                            }
                                            required
                                        />
                                        <label htmlFor="floatingOriginAirportId">Origin Airport</label>
                                        {loadingSuggestions && <div>Loading...</div>}
                                        {originAirportSuggestions.length > 0 && (
                                            <ul className="suggestion-list">
                                                {originAirportSuggestions.map((airport) => (
                                                    <li
                                                        key={airport.airportId}
                                                        onClick={() => handleSelectAirport(airport, "originAirportId")}
                                                    >
                                                        {`${airport.airportName} (${airport.airportCode})`}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Destination Airport */}
                                    <div className="form-floating mb-3 position-relative">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="floatingDestinationAirportId"
                                            placeholder="Destination Airport"
                                            value={form.destinationAirportId}
                                            onChange={(e) =>
                                                handleSearchAirport(e.target.value, "destinationAirportId")
                                            }
                                            required
                                        />
                                        <label htmlFor="floatingDestinationAirportId">
                                            Destination Airport
                                        </label>
                                        {loadingSuggestions && <div>Loading...</div>}
                                        {destinationAirportSuggestions.length > 0 && (
                                            <ul className="suggestion-list">
                                                {destinationAirportSuggestions.map((airport) => (
                                                    <li
                                                        key={airport.airportId}
                                                        onClick={() => handleSelectAirport(airport, "destinationAirportId")}
                                                    >
                                                        {`${airport.airportName} (${airport.airportCode})`}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Distance */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="floatingDistance"
                                            placeholder="Distance"
                                            value={form.distance}
                                            onChange={(e) =>
                                                setForm({ ...form, distance: e.target.value })
                                            }
                                            required
                                        />
                                        <label htmlFor="floatingDistance">Distance (km)</label>
                                    </div>

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
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightRouteManagement;
