// src/components/modals/EditFlightModal.js
import React from "react";

const EditFlightModal = ({ visible, form, onFormChange, onSave, onClose }) => {
  if (!visible) return null;

  const handleSeatAllocationChange = (index, key, value) => {
    const updatedAllocations = [...form.seatAllocations];
    updatedAllocations[index][key] = value;
    onFormChange({ ...form, seatAllocations: updatedAllocations });
  };

  const addSeatAllocation = () => {
    onFormChange({
      ...form,
      seatAllocations: [
        ...form.seatAllocations,
        { className: "", availableSeats: null },
      ],
    });
  };

  const removeSeatAllocation = (index) => {
    const updatedAllocations = form.seatAllocations.filter((_, i) => i !== index);
    onFormChange({ ...form, seatAllocations: updatedAllocations });
  };

  return (
    <div className="modal show d-block flight-modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Flight</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSave();
              }}
            >
              {/* Read-only fields */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Flight Number"
                  value={form.flightNumber}
                  disabled
                />
                <label>Flight Number</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Airline"
                  value={form.airlineName}
                  disabled
                />
                <label>Airline</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Origin Airport"
                  value={form.originAirportName}
                  disabled
                />
                <label>Origin Airport</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Destination Airport"
                  value={form.destinationAirportName}
                  disabled
                />
                <label>Destination Airport</label>
              </div>

              {/* Editable fields */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={form.departureTime || ""}
                      onChange={(e) =>
                        onFormChange({ ...form, departureTime: e.target.value })
                      }
                      required
                    />
                    <label>Departure Time</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={form.arrivalTime || ""}
                      onChange={(e) =>
                        onFormChange({ ...form, arrivalTime: e.target.value })
                      }
                      required
                    />
                    <label>Arrival Time</label>
                  </div>
                </div>
              </div>

              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Duration (minutes)"
                  value={form.duration || ""}
                  onChange={(e) =>
                    onFormChange({ ...form, duration: parseInt(e.target.value) || 0 })
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
                    onFormChange({ ...form, totalSeats: parseInt(e.target.value) || 0 })
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
                    onFormChange({ ...form, basePrice: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
                <label>Base Price</label>
              </div>

              <div className="form-floating mb-3">
                <select
                  className="form-control"
                  value={form.status}
                  onChange={(e) =>
                    onFormChange({ ...form, status: e.target.value })
                  }
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DELAYED">Delayed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <label>Status</label>
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
                      handleSeatAllocationChange(index, "className", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    className="form-control mb-1"
                    placeholder="Available Seats"
                    value={allocation.availableSeats || ""}
                    onChange={(e) =>
                      handleSeatAllocationChange(index, "availableSeats", parseInt(e.target.value))
                    }
                    required
                    min="0"
                  />
                </div>
              ))}

              {/* Form Actions */}
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFlightModal;
