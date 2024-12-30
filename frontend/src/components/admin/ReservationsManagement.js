import React, { useEffect, useState } from "react";
import {
  searchReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../../services/adminApi";
import "../../assets/css/Admin/ReservationsManagement.css";

const ReservationManagement = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    reservationCode: "",
    userId: "",
    flightId: "",
    includeCancelled: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({
    reservationCode: "",
    userId: "",
    flightId: "",
    allocationId: "",
    reservationStatus: "",
    totalPrice: 0,
    travelDate: "",
  });

  useEffect(() => {
    fetchReservations();
  }, [filters]);

  const fetchReservations = async () => {
    try {
      const response = await searchReservations(filters);
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      alert("Failed to fetch reservations.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        await updateReservation(editingRecord.reservationId, form);
        alert("Reservation updated successfully!");
      } else {
        await createReservation(form);
        alert("Reservation added successfully!");
      }

      setModalVisible(false);
      fetchReservations();
    } catch (error) {
      console.error("Error during save operation:", error);
      alert("Failed to save the reservation. Check the console for details.");
    }
  };

  const handleDelete = async (record) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the reservation with code ${record.reservationCode}?`
      )
    )
      return;

    try {
      await deleteReservation(record.reservationId);
      alert("Reservation deleted successfully");
      fetchReservations();
    } catch (error) {
      alert("Failed to delete reservation");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="reservation-management__container mt-4">
      <h2>Reservation Management</h2>

      {/* Search Filters */}
      <div className="reservation-management__search mb-3">
        <input
          type="text"
          name="reservationCode"
          placeholder="Search by reservation code..."
          className="form-control mb-2"
          value={filters.reservationCode}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="userId"
          placeholder="Search by user ID..."
          className="form-control mb-2"
          value={filters.userId}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="flightId"
          placeholder="Search by flight ID..."
          className="form-control mb-2"
          value={filters.flightId}
          onChange={handleFilterChange}
        />
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="includeCancelled"
            name="includeCancelled"
            checked={filters.includeCancelled}
            onChange={handleFilterChange}
          />
          <label className="form-check-label" htmlFor="includeCancelled">
            Show Cancelled Reservations
          </label>
        </div>
      </div>

      {/* Add reservation button */}
      <button
        className="btn btn-primary reservation-management__add-button mb-3"
        onClick={() => {
          setForm({
            reservationCode: "",
            userId: "",
            flightId: "",
            allocationId: "",
            reservationStatus: "",
            totalPrice: 0,
            travelDate: "",
          });
          setEditingRecord(null);
          setModalVisible(true);
        }}
      >
        Add Reservation
      </button>

      {/* Modal for Add/Edit */}
      {modalVisible && (
        <div
          className="modal show d-block reservation-management__modal"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRecord ? "Edit Reservation" : "Add Reservation"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
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

                        // Update the status in the form state
                        setForm({ ...form, reservationStatus: newStatus });
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

                  {/* Other fields are read-only */}
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
                      value={new Date(form.travelDate)
                        .toISOString()
                        .slice(0, 16)} // Read-only
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

      {/* Reservations table */}
      <div className="table-responsive">
        <table className="table table-striped reservation-management__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Reservation ID</th>
              <th>Reservation Code</th>
              <th>User ID</th>
              <th>Flight ID</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Travel Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReservations.length > 0 ? (
              currentReservations.map((reservation, index) => (
                <tr key={reservation.reservationId}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{reservation.reservationId}</td>
                  <td>{reservation.reservationCode}</td>
                  <td>{reservation.userId}</td>
                  <td>{reservation.flightId}</td>
                  <td>{reservation.reservationStatus}</td>
                  <td>{reservation.totalPrice.toFixed(2)}</td>
                  <td>
                    {reservation.formattedTravelDate ||
                      new Date(reservation.travelDate).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm me-2 ${
                        reservation.reservationStatus === "Cancelled"
                          ? "btn-secondary"
                          : "btn-warning"
                      }`}
                      onClick={() => {
                        setForm({
                          reservationCode: reservation.reservationCode,
                          userId: reservation.userId,
                          flightId: reservation.flightId,
                          allocationId: reservation.allocationId,
                          reservationStatus: reservation.reservationStatus,
                          totalPrice: reservation.totalPrice,
                          travelDate: reservation.travelDate,
                        });
                        setEditingRecord(reservation);
                        setModalVisible(true);
                      }}
                      disabled={reservation.reservationStatus === "Cancelled"}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No reservations available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="reservation-management__pagination d-flex justify-content-between align-items-center">
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
    </div>
  );
};

export default ReservationManagement;
