import React from "react";

const EditReservationModal = ({
  visible,
  form,
  onFormChange,
  onSave,
  onClose,
}) => {
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
            <h5 className="modal-title">Edit Reservation</h5>
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
                onSave();
              }}
            >
              {/* ReservationStatus - Editable */}
              <div className="form-floating mb-3">
                <select
                  className="form-control"
                  value={form.reservationStatus}
                  onChange={(e) => {
                    const newStatus = e.target.value;

                    if (newStatus === "Cancelled") {
                      const confirmCancellation = window.confirm(
                        "Are you sure you want to cancel this reservation? This action cannot be undone."
                      );
                      if (!confirmCancellation) {
                        return; // User canceled the action
                      }
                    }

                    onFormChange({ ...form, reservationStatus: newStatus });
                  }}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <label>Status</label>
              </div>

              {/* Read-only fields */}
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Reservation Code"
                  value={form.reservationCode}
                  disabled
                />
                <label>Reservation Code</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="User ID"
                  value={form.userId}
                  disabled
                />
                <label>User ID</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Flight ID"
                  value={form.flightId}
                  disabled
                />
                <label>Flight ID</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="datetime-local"
                  className="form-control"
                  placeholder="Travel Date"
                  value={
                    form.travelDate
                      ? new Date(form.travelDate).toISOString().slice(0, 16)
                      : ""
                  }
                  disabled
                />
                <label>Travel Date</label>
              </div>

              {/* Form Actions */}
              <button type="submit" className="btn btn-primary">
                Save
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

export default EditReservationModal;
