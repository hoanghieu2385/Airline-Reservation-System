// src/components/modals/FlightModal.js
import React from "react";
import "../../assets/css/Admin/Modals/FlightModal.css";

const FlightModal = ({
  visible,
  form,
  setForm,
  onClose,
  onSubmit,
  airlines,
  airports,
  editingFlight,
}) => {
  if (!visible) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSeatAllocationChange = (index, key, value) => {
    const updatedAllocations = [...form.seatAllocations];
    updatedAllocations[index][key] = value;
    setForm({ ...form, seatAllocations: updatedAllocations });
  };

  const addSeatAllocation = () => {
    setForm((prevForm) => ({
      ...prevForm,
      seatAllocations: [
        ...prevForm.seatAllocations,
        { className: "", availableSeats: null },
      ],
    }));
  };

  const removeSeatAllocation = (index) => {
    const updatedAllocations = form.seatAllocations.filter(
      (_, i) => i !== index
    );
    setForm({ ...form, seatAllocations: updatedAllocations });
  };

  return (
    <div
      className="modal show d-block flight-modal"
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingFlight ? "Edit Flight" : "Add Flight"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="flight-modal-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(form);
              }}
            >
              <div className="form-floating mb-3">
                <input
                  type="text"
                  name="flightNumber"
                  className="form-control"
                  placeholder="Flight Number"
                  value={form.flightNumber}
                  onChange={handleInputChange}
                  disabled={!!editingFlight}
                  required
                />
                <label>Flight Number</label>
              </div>

              <div className="form-floating mb-3">
                <select
                  name="airlineId"
                  className="form-control"
                  value={form.airlineId}
                  onChange={handleInputChange}
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
                  name="originAirportId"
                  className="form-control"
                  value={form.originAirportId}
                  onChange={handleInputChange}
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
                  name="destinationAirportId"
                  className="form-control"
                  value={form.destinationAirportId}
                  onChange={handleInputChange}
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

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="datetime-local"
                      name="departureTime"
                      className="form-control"
                      value={form.departureTime}
                      onChange={handleInputChange}
                      required
                    />
                    <label>Departure Time</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="datetime-local"
                      name="arrivalTime"
                      className="form-control"
                      value={form.arrivalTime}
                      onChange={handleInputChange}
                      required
                    />
                    <label>Arrival Time</label>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      name="totalSeats"
                      className="form-control"
                      value={form.totalSeats || ""}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "totalSeats",
                            value: parseInt(e.target.value) || null,
                          },
                        })
                      }
                      required
                      min="0"
                    />
                    <label>Total Seats</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      name="duration"
                      className="form-control"
                      value={form.duration || ""}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "duration",
                            value: parseInt(e.target.value) || null,
                          },
                        })
                      }
                      required
                      min="0"
                    />
                    <label>Duration (minutes)</label>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      name="basePrice"
                      className="form-control"
                      value={form.basePrice || ""}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "basePrice",
                            value: parseFloat(e.target.value) || null,
                          },
                        })
                      }
                      required
                      min="0"
                      step="0.01"
                    />
                    <label>Base Price</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating mb-3">
                    <select
                      name="status"
                      className="form-control"
                      value={form.status}
                      onChange={handleInputChange}
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

              <label>Seat Classes</label>
              {(form.seatAllocations || []).map((allocation, index) => (
                <div key={index} className="mb-3 border p-3 rounded">
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Class Name"
                    value={allocation.className}
                    onChange={(e) =>
                      handleSeatAllocationChange(
                        index,
                        "className",
                        e.target.value
                      )
                    }
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Available Seats"
                    value={allocation.availableSeats || ""}
                    onChange={(e) =>
                      handleSeatAllocationChange(
                        index,
                        "availableSeats",
                        parseInt(e.target.value)
                      )
                    }
                    required
                    min="0"
                  />
                </div>
              ))}

              <div className="flight-modal-seat-buttons mb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addSeatAllocation}
                >
                  Add Seat Class
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    setForm({
                      ...form,
                      seatAllocations: form.seatAllocations.slice(0, -1),
                    })
                  }
                >
                  Remove Seat Class
                </button>
              </div>

              <div className="modal-footer">
                <div className="flight-modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingFlight ? "Update Flight" : "Add Flight"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightModal;
