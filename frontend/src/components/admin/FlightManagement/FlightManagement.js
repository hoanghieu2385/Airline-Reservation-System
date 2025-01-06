// FlightManagement.js
import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import AddFlightModal from "../../modals/AddFlightModal";
import EditFlightModal from "../../modals/EditFlightModal";
import FlightTable from "./FightTable";
import {
  getFlights,
  getAirlines,
  getAirports,
  createFlight,
  updateFlight,
  deleteFlight,
} from "../../../services/adminApi";
import {
  notifyWarning,
  notifySuccess,
  notifyError,
} from "../../../utils/notification";

const FlightManagement = () => {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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

  const handleFormSubmit = async (data) => {
    try {
      if (editingFlight) {
        await updateFlight(editingFlight.flightId, data);
        notifySuccess("Flight updated successfully!");
      } else {
        await createFlight(data);
        notifySuccess("Flight created successfully!");
      }
      setModalVisible(false);
      const response = await getFlights();
      setFlights(response.data || []);
      setEditingFlight(null);
    } catch (error) {
      console.error("Error saving flight:", error);
      notifyError("Failed to save flight.");
    }
  };

  const handleDelete = async (flightId) => {
    if (
      !flightId ||
      !window.confirm("Are you sure you want to delete this flight?")
    ) {
      return;
    }

    try {
      await deleteFlight(flightId);
      const response = await getFlights();
      setFlights(response.data || []);
      notifySuccess("Flight deleted successfully!");
    } catch (error) {
      console.error("Error deleting flight:", error);
      notifyError("Failed to delete flight.");
    }
  };

  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      flight.flightNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      flight.airlineName.toLowerCase().includes(searchText.toLowerCase()) ||
      flight.originAirportName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      flight.destinationAirportName
        .toLowerCase()
        .includes(searchText.toLowerCase());
    return showCompleted ? matchesSearch : matchesSearch && flight.status !== "COMPLETED";
  });

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="flight-management__container mt-4">
      <h2>Flight Management</h2>

      {actionError && <Alert variant="destructive">{actionError}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <div className="form-check mt-2">
          <input
            type="checkbox"
            className="form-check-input"
            id="showCompleted"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showCompleted">
            Show Completed Flights
          </label>
        </div>
      </div>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setModalVisible(true);
          setEditingFlight(null);
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
        }}
      >
        Add Flight
      </button>

      <FlightTable
        flights={filteredFlights}
        onEdit={(flight) => {
          setModalVisible(true);
          setEditingFlight(flight);
          setForm({ ...flight });
        }}
        onDelete={handleDelete}
      />

      {modalVisible && editingFlight ? (
        <EditFlightModal
          visible={modalVisible}
          form={form}
          onFormChange={setForm}
          onSave={() => handleFormSubmit(form)}
          onClose={() => {
            setModalVisible(false);
            setEditingFlight(null);
          }}
        />
      ) : (
        modalVisible && (
          <AddFlightModal
            visible={modalVisible}
            form={form}
            setForm={setForm}
            onClose={() => setModalVisible(false)}
            onSubmit={handleFormSubmit}
            airlines={airlines}
            airports={airports}
          />
        )
      )}
    </div>
  );
};

export default FlightManagement;
