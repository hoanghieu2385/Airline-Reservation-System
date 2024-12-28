import React, { useEffect, useState } from "react";
import {
  getReservations,
  getReservationByCode,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../../services/adminApi";

const ReservationManagement = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
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
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getReservations();
      setData(response.data || []);
    } catch (error) {
      alert("Failed to fetch reservations");
    }
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

  const filteredData = data.filter((reservation) =>
    reservation.reservationCode
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="reservation-management__container mt-4">
      <h2>Reservation Management</h2>

      {/* Search bar */}
      <div className="reservation-management__search mb-3">
        <input
          type="text"
          placeholder="Search by reservation code..."
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
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
                  <td>{new Date(reservation.travelDate).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setForm(reservation);
                        setEditingRecord(reservation);
                        setModalVisible(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(reservation)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
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

      {/* Add/Edit modal */}
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
                  {/* Reservation fields */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Reservation Code"
                      value={form.reservationCode}
                      onChange={(e) =>
                        setForm({ ...form, reservationCode: e.target.value })
                      }
                      required
                    />
                    <label>Reservation Code</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="User ID"
                      value={form.userId}
                      onChange={(e) =>
                        setForm({ ...form, userId: e.target.value })
                      }
                      required
                    />
                    <label>User ID</label>
                  </div>
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
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Status"
                      value={form.reservationStatus}
                      onChange={(e) =>
                        setForm({ ...form, reservationStatus: e.target.value })
                      }
                      required
                    />
                    <label>Status</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Total Price"
                      value={form.totalPrice}
                      onChange={(e) =>
                        setForm({ ...form, totalPrice: e.target.value })
                      }
                      required
                    />
                    <label>Total Price</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="datetime-local"
                      className="form-control"
                      placeholder="Travel Date"
                      value={form.travelDate}
                      onChange={(e) =>
                        setForm({ ...form, travelDate: e.target.value })
                      }
                      required
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
    </div>
  );
};

export default ReservationManagement;
