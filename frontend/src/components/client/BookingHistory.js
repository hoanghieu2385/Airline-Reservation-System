import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../assets/css/ClientDashboard/BookingHistory.css";
// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`booking-history-modal__overlay ${
        isOpen ? "booking-history-modal__overlay--active" : ""
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="booking-history-modal__content">
        <button className="booking-history-modal__close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

// Cancel Modal Component
const CancelModal = () => (
  <>
    <h2 className="booking-history-modal__title">Cancel Booking Instructions</h2>
    <div className="booking-history-modal__body">
      <p>
        To cancel your flight booking, please contact our customer service team.
        Based on our{" "}
        <Link to="/RefundPolicies" className="text-blue-600 hover:underline">
          Cancel/Refund policies
        </Link>
        , our team will guide you through the cancellation process and any
        applicable refunds.
      </p>

      <div className="booking-history-modal__contact-info">
        <h3 className="font-semibold mb-3">Contact Information:</h3>
        <div className="booking-history-modal__contact-item">
          <span>📞</span>
          <span>Phone: +84 123 456 789</span>
        </div>
        <div className="booking-history-modal__contact-item">
          <span>✉️</span>
          <span>Email: support@airlineservice.com</span>
        </div>
      </div>

      <p className="mb-2">
        Please have your booking reference number ready when contacting us.
      </p>
      <p className="mb-2">
        Our customer service team is available 24/7 to assist you with your
        cancellation request.
      </p>
      <p className="booking-history-modal__note">
        Note: Cancellation fees may apply depending on your fare type and how
        close to the departure date you are cancelling.
      </p>
    </div>
  </>
);

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem("userId");

      // Fetch all necessary data in parallel
      const [reservationsResponse, flightsResponse, allocationResponse] = await Promise.all([
        api.get("/reservations"),
        api.get("/flight"),
        api.get("/FlightSeatAllocation")
      ]);

      const allReservations = reservationsResponse.data;
      const flights = flightsResponse.data;
      const allocations = allocationResponse.data;

      // Filter reservations for current user
      const userReservations = allReservations.filter(
        booking => booking.userId === userId
      );

      const data = userReservations.map((booking) => {
        const flight = flights.find((f) => f.flightId === booking.flightId);
        const allocation = allocations.find((a) => a.allocationId === booking.allocationId);

        return {
          id: booking.reservationId,
          reservationCode: booking.reservationCode,
          flightId: booking.flightId,
          allocationId: booking.allocationId,
          flightNumber: flight ? flight.flightNumber : "N/A",
          from: flight ? flight.originAirportName : "N/A",
          to: flight ? flight.destinationAirportName : "N/A",
          date: booking.travelDate,
          price: booking.totalPrice,
          paymentStatus: booking.reservationStatus === "Paid",
          status: booking.reservationStatus,
          seatClass: allocation ? allocation.seatClassName : "N/A",
          numberOfPassengers: booking.numberOfBlockedSeats || 0
        };
      });

      // Sort bookings by date, most recent first
      data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setBookings(data);
      setFilteredBookings(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
      setError("Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredBookings(bookings);
    } else if (filter === "paid") {
      setFilteredBookings(bookings.filter((booking) => booking.paymentStatus));
    } else if (filter === "pending") {
      setFilteredBookings(bookings.filter((booking) => !booking.paymentStatus));
    } else {
      setFilteredBookings(
        bookings.filter((booking) => booking.status === filter)
      );
    }
  }, [filter, bookings]);

  const handleViewDetails = (booking) => {
    navigate(`/eticket?reservationCode=${booking.reservationCode}`);
  };

  const handleConfirmReservation = async (booking) => {
    try {
      const passengersResponse = await fetch(
        `https://localhost:7238/api/Passenger/Passengers?reservationId=${booking.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!passengersResponse.ok) {
        const errorMessage = await passengersResponse.text();
        console.error("Backend error:", errorMessage);
        throw new Error("Failed to fetch passengers.");
      }

      const passengers = await passengersResponse.json();

      const reservationData = {
        userId: sessionStorage.getItem("userId"),
        tripDetails: {
          airlineName: booking.airlineName || "N/A",
          flightNumber: booking.flightNumber || "N/A",
          flightId: booking.flightId,
          departureTime: booking.date,
          allocationId: booking.allocationId,
        },
        totalPrice: booking.price,
        passengers: passengers,
        contactInfo: {
          firstName: sessionStorage.getItem("userFirstName") || "DefaultFirstName",
          lastName: sessionStorage.getItem("userLastName") || "DefaultLastName",
          email: sessionStorage.getItem("userEmail") || "default@example.com",
          phone: sessionStorage.getItem("userPhone") || "123456789",
        },
      };

      sessionStorage.setItem("checkoutData", JSON.stringify(reservationData));
      navigate("/payment");
    } catch (error) {
      console.error("Error preparing reservation data:", error);
      setError("Failed to prepare reservation data. Please try again.");
    }
  };

  return (
    <div className="flight-booking">
      <div className="flight-booking__header">
        <h2 className="flight-booking__title">Booking History</h2>
        <div className="flight-booking__filter">
          <label className="flight-booking__filter-label">Filter:</label>
          <select
            className="flight-booking__filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Bookings</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Blocked">Blocked</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CancelModal />
      </Modal>

      {loading && <div className="flight-booking__loading">Loading...</div>}
      {error && <div className="flight-booking__error">{error}</div>}
      
      {!loading && !error && filteredBookings.length === 0 ? (
        <div className="flight-booking__empty">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="flight-booking__table-wrapper">
          <table className="flight-booking__table">
            <thead>
              <tr>
                <th>Flight Number</th>
                <th>From</th>
                <th>To</th>
                <th>Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.reservationCode}>
                  <td>{booking.flightNumber}</td>
                  <td>{booking.from}</td>
                  <td>{booking.to}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>${booking.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={`flight-booking__status ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button
                      className="flight-booking__action-btn"
                      onClick={() => handleViewDetails(booking)}
                    >
                      Details
                    </button>
                    {booking.status === "Blocked" && (
                      <button
                        className="flight-booking__action-btn confirm"
                        onClick={() => handleConfirmReservation(booking)}
                      >
                        Confirm Reservation
                      </button>
                    )}
                    <button
                      className="flight-booking__action-btn cancel"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;

