import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../assets/css/ClientDashboard/BookingHistory.css";

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

const CancelModal = () => (
  <>
    <h2 className="booking-history-modal__title">
      Cancel Booking Instructions
    </h2>
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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const reservationsResponse = await api.get("/reservations");
        const flightsResponse = await api.get("/flight");
        const flights = flightsResponse.data;

        const data = reservationsResponse.data.map((booking) => {
          const flight = flights.find((f) => f.flightId === booking.flightId);

          return {
            id: booking.reservationId,
            reservationCode: booking.reservationCode,
            flightNumber: flight ? flight.flightNumber : "N/A",
            airlineName: flight ? flight.airlineName : "N/A",
            flightId: flight ? flight.flightId : null,
            from: flight ? flight.originAirportName : "N/A",
            to: flight ? flight.destinationAirportName : "N/A",
            date: booking.travelDate,
            price: booking.totalPrice,
            paymentStatus: booking.reservationStatus === "Paid",
            status: booking.reservationStatus,
          };
        });

        data.sort((a, b) => new Date(a.date) - new Date(b.date));

        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredBookings(bookings);
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
      console.log("Booking ID:", booking.id);

      // Fetch reservation details to get AllocationId
      const reservationResponse = await fetch(
        `https://localhost:7238/api/Reservations/${booking.reservationCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!reservationResponse.ok) {
        const errorMessage = await reservationResponse.text();
        console.error("Backend error fetching reservation:", errorMessage);
        throw new Error("Failed to fetch reservation details.");
      }

      const reservationDetails = await reservationResponse.json();
      console.log("Reservation Details:", reservationDetails);

      const allocationId = reservationDetails.allocationId;

      if (!allocationId) {
        throw new Error("Allocation ID is missing in the reservation.");
      }

      // Fetch passengers
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
        console.error("Backend error fetching passengers:", errorMessage);
        throw new Error("Failed to fetch passengers.");
      }

      let passengers = await passengersResponse.json();
      passengers = passengers.map((p) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        gender: p.gender,
        email: p.email,
        phoneNumber: p.phoneNumber,
      }));
      console.log("Mapped Passengers:", passengers);
      sessionStorage.setItem("passengers", JSON.stringify(passengers));

      // Fetch seat class using AllocationId
      const seatClassResponse = await fetch(
        `https://localhost:7238/api/SeatClass/GetClassNameByFlightAndAllocation?flightId=${booking.flightId}&allocationId=${allocationId}`
      );

      if (!seatClassResponse.ok) {
        const errorMessage = await seatClassResponse.text();
        console.error("Backend error fetching seat class:", errorMessage);
        throw new Error("Failed to fetch seat class.");
      }

      console.log("Seat Class Response:", seatClassResponse);

      const seatClassRaw = await seatClassResponse.text();
      const seatClass = seatClassRaw.trim();
      console.log("Validated Seat Class:", seatClass);

      // Retrieve user data from userProfile
      const userProfile =
        JSON.parse(sessionStorage.getItem("userProfile")) || {};

      // Prepare reservation data
      const reservationData = {
        userId: sessionStorage.getItem("userId"),
        reservationId: booking.id,
        tripDetails: {
          airlineName: booking.airlineName || "N/A",
          flightNumber: booking.flightNumber || "N/A",
          flightId: booking.flightId,
          departureTime: booking.date,
          allocationId: allocationId || "N/A",
          seatClass: seatClass || "N/A",
        },
        totalPrice: booking.price,
        passengers,
        contactInfo: {
          firstName: userProfile.firstName || "Guest",
          lastName: userProfile.lastName || "User",
          email: userProfile.email || "default@example.com",
          phoneNumber: userProfile.phoneNumber || "123456789",
        },
      };

      console.log("Prepared Reservation Data:", reservationData);

      // Store reservation data in sessionStorage
      sessionStorage.setItem("checkoutData", JSON.stringify(reservationData));

      // Navigate to the Payment page
      navigate("/payment");
    } catch (error) {
      console.error("Error preparing reservation data:", error);
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
            <option value="Cancelled">Cancelled</option>
            <option value="Blocked">Blocked</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CancelModal />
      </Modal>

      {filteredBookings.length === 0 ? (
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
                <tr key={booking.code}>
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
                    {booking.status === "Blocked" && (
                      <button
                        className="flight-booking__action-btn confirm btn btn-success"
                        onClick={() => handleConfirmReservation(booking)}
                      >
                        Confirm Reservation
                      </button>
                    )}
                    <button
                      className="flight-booking__action-btn btn btn-primary"
                      onClick={() => handleViewDetails(booking)}
                    >
                      Details
                    </button>
                    <button
                      className="flight-booking__action-btn cancel btn btn-danger"
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
