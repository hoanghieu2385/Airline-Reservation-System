import React from "react";

const FlightTable = ({ flights, onEdit, onDelete }) => {
    return (
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
                    {flights.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="text-center">No flights found</td>
                        </tr>
                    ) : (
                        flights.map((flight, index) => (
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
                                            onClick={() => onEdit(flight)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onDelete(flight.flightId)}
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
    );
};

export default FlightTable;
