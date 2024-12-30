import React, { useState } from "react";

const AddReservationModal = ({ visible, onClose, onSubmit, initialForm }) => {
  const [form, setForm] = useState(initialForm);

  if (!visible) return null;

  return (
    <div
      className="modal show d-block reservation-management__modal"
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Reservation</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(form);
              }}
            >
              {/* User ID */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="User ID"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  required
                />
                <label>User ID</label>
              </div>

              {/* Flight ID */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Flight ID"
                  value={form.flightId}
                  onChange={(e) =>
                    setForm({ ...form, flightId: e.target.value })
                  }
                  required
                />
                <label>Flight ID</label>
              </div>

              {/* Allocation ID */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Allocation ID"
                  value={form.allocationId}
                  onChange={(e) =>
                    setForm({ ...form, allocationId: e.target.value })
                  }
                  required
                />
                <label>Allocation ID</label>
              </div>

              {/* Reservation Status */}
              <div className="form-floating mb-3">
                <select
                  className="form-control"
                  value={form.reservationStatus}
                  onChange={(e) =>
                    setForm({ ...form, reservationStatus: e.target.value })
                  }
                  required
                >
                  <option value="Blocked">
                    Blocked (Hold seats temporarily)
                  </option>
                  <option value="Confirmed">
                    Confirmed (Immediately reserve)
                  </option>
                </select>
                <label>Status</label>
              </div>

              {/* Passengers */}
              <label>Passengers</label>
              {(form.passengers || []).map((passenger, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="First Name"
                    value={passenger.firstName}
                    onChange={(e) => {
                      const updatedPassengers = [...form.passengers];
                      updatedPassengers[index].firstName = e.target.value;
                      setForm({ ...form, passengers: updatedPassengers });
                    }}
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Last Name"
                    value={passenger.lastName}
                    onChange={(e) => {
                      const updatedPassengers = [...form.passengers];
                      updatedPassengers[index].lastName = e.target.value;
                      setForm({ ...form, passengers: updatedPassengers });
                    }}
                    required
                  />
                  <select
                    className="form-control mb-1"
                    value={passenger.gender}
                    onChange={(e) => {
                      const updatedPassengers = [...form.passengers];
                      updatedPassengers[index].gender = e.target.value;
                      setForm({ ...form, passengers: updatedPassengers });
                    }}
                    required
                  >
                    <option value="">Select Title</option>
                    <option value="Male">Mr</option>
                    <option value="Female">Mrs</option>
                  </select>
                  <input
                    type="email"
                    className="form-control mb-1"
                    placeholder="Email"
                    value={passenger.email}
                    onChange={(e) => {
                      const updatedPassengers = [...form.passengers];
                      updatedPassengers[index].email = e.target.value;
                      setForm({ ...form, passengers: updatedPassengers });
                    }}
                    required
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Phone Number"
                    value={passenger.phoneNumber}
                    onChange={(e) => {
                      const updatedPassengers = [...form.passengers];
                      updatedPassengers[index].phoneNumber = e.target.value;
                      setForm({ ...form, passengers: updatedPassengers });
                    }}
                    required
                  />
                </div>
              ))}

              {/* Add Passenger Button */}
              <button
                type="button"
                className="btn btn-secondary mb-3"
                onClick={() => {
                  console.log("Current passengers:", form.passengers);
                  setForm({
                    ...form,
                    passengers: [
                      ...(form.passengers || []),
                      {
                        firstName: "",
                        lastName: "",
                        gender: "",
                        email: "",
                        phoneNumber: "",
                      },
                    ],
                  });
                }}
              >
                Add Passenger
              </button>

              {/* Form Actions */}
              <button type="submit" className="btn btn-primary">
                Add
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

export default AddReservationModal;