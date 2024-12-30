import React, { useEffect, useState } from "react";
import {
  searchReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  finalizeReservation,
} from "../../services/adminApi";
import "../../assets/css/Admin/ReservationsManagement.css";
import AddReservationModal from "../modals/AddReservationModal";
import EditReservationModal from "../modals/EditReservationModal";

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

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

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

  // const handleDelete = async (record) => {
  //   if (
  //     !window.confirm(
  //       `Are you sure you want to delete the reservation with code ${record.reservationCode}?`
  //     )
  //   )
  //     return;

  //   try {
  //     await deleteReservation(record.reservationId);
  //     alert("Reservation deleted successfully");
  //     fetchReservations();
  //   } catch (error) {
  //     alert("Failed to delete reservation");
  //   }
  // };

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
            userId: "",
            flightId: "",
            allocationId: "",
            reservationStatus: "Blocked", // Default to "Blocked"
            passengers: [],
          });
          setAddModalVisible(true);
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
                        setEditModalVisible(true);
                      }}
                      disabled={reservation.reservationStatus === "Cancelled"}
                    >
                      Edit
                    </button>

                    {/* <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(reservation)}
                    >
                      Delete
                    </button> */}
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

      {/* AddReservationModal */}
      <AddReservationModal
        visible={addModalVisible}
        onClose={() => {
          setAddModalVisible(false);
          setForm({
            userId: "",
            flightId: "",
            allocationId: "",
            reservationStatus: "Blocked",
            passengers: [],
          });
        }}
        onSubmit={async (formData) => {
          try {
            await finalizeReservation(formData);
            alert("Reservation added successfully!");
            setAddModalVisible(false);
            fetchReservations();
          } catch (error) {
            console.error("Error adding reservation:", error);
            alert("Failed to add reservation.");
          }
        }}
        initialForm={form}
      />

      {/* EditReservationModal */}
      <EditReservationModal
        visible={editModalVisible}
        form={form}
        onFormChange={(updatedForm) => setForm(updatedForm)}
        onSave={async () => {
          try {
            await updateReservation(editingRecord.reservationId, form);
            alert("Reservation updated successfully!");
            setEditModalVisible(false);
            fetchReservations();
          } catch (error) {
            console.error("Error updating reservation:", error);
            alert("Failed to update reservation.");
          }
        }}
        onClose={() => setEditModalVisible(false)}
      />
    </div>
  );
};

export default ReservationManagement;
