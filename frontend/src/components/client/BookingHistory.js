import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import api from "../../services/api";
import '../../assets/css/ClientDashboard/BookingHistory.css'

const Modal = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.keyCode === 27) onClose();
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    return (
        <div 
            className={`booking-history-modal__overlay ${isOpen ? 'booking-history-modal__overlay--active' : ''}`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="booking-history-modal__content">
                <button className="booking-history-modal__close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

const CancelModal = () => (
    <>
        <h2 className="booking-history-modal__title">Cancel Booking Instructions</h2>
        <div className="booking-history-modal__body">
            <p>
                To cancel your flight booking, please contact our customer service team. 
                Based on our <Link to="/policies" className="text-blue-600 hover:underline">Cancel/Refund policies</Link>, 
                our team will guide you through the cancellation process and any applicable refunds.
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

            <p className="mb-2">Please have your booking reference number ready when contacting us.</p>
            <p className="mb-2">Our customer service team is available 24/7 to assist you with your cancellation request.</p>
            <p className="booking-history-modal__note">Note: Cancellation fees may apply depending on your fare type and how close to the departure date you are cancelling.</p>
        </div>
    </>
);

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [filter, setFilter] = useState("all");
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const reservationsResponse = await api.get('/reservations');
                const flightsResponse = await api.get('/flight');
                const flights = flightsResponse.data;

                const data = reservationsResponse.data.map((booking) => {
                    const flight = flights.find(f => f.flightId === booking.flightId);

                    return {
                        id: booking.reservationCode,
                        flightNumber: flight ? flight.flightNumber : 'N/A',
                        from: flight ? flight.originAirportName : 'N/A',
                        to: flight ? flight.destinationAirportName : 'N/A',
                        date: booking.travelDate,
                        price: booking.totalPrice,
                        paymentStatus: booking.reservationStatus === "Paid",
                    };
                });

                setBookings(data);
            } catch (error) {
                console.error("Error fetching bookings: ", error);
            }
        };

        fetchBookings();
    }, []);

    // Lọc danh sách bookings theo filter
    useEffect(() => {
        if (filter === "all") {
            setFilteredBookings(bookings);
        } else if (filter === "paid") {
            setFilteredBookings(bookings.filter((booking) => booking.paymentStatus));
        } else if (filter === "pending") {
            setFilteredBookings(bookings.filter((booking) => !booking.paymentStatus));
        }
    }, [filter, bookings]);

    const ModalContent = () => (
        <div className="space-y-4">
            <p>
                To cancel your flight booking, please contact our customer service team.
                Based on our <Link to="/policies" className="text-blue-600 hover:underline">Cancel/Refund policies</Link>,
                our team will guide you through the cancellation process and any applicable refunds.
            </p>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Contact Information:</h4>
                <div className="space-y-2">
                    <p>📞 Phone: +84 123 456 789</p>
                    <p>✉️ Email: support@airlineservice.com</p>
                </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                <p>Please have your booking reference number ready when contacting us.</p>
                <p>Our customer service team is available 24/7 to assist you with your cancellation request.</p>
                <p>Note: Cancellation fees may apply depending on your fare type and how close to the departure date you are cancelling.</p>
            </div>
        </div>
    );

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
                                <tr key={booking.id}>
                                    <td>{booking.flightNumber}</td>
                                    <td>{booking.from}</td>
                                    <td>{booking.to}</td>
                                    <td>{new Date(booking.date).toLocaleDateString()}</td>
                                    <td>${booking.price.toFixed(2)}</td>
                                    <td>
                                        <span
                                            className={`flight-booking__status ${booking.paymentStatus ? "paid" : "pending"
                                                }`}
                                        >
                                            {booking.paymentStatus ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="space-x-2">
                                        <button
                                            className="flight-booking__action-btn detail"
                                            onClick={() => alert("Details clicked")} // Hoặc logic chi tiết của bạn
                                        >
                                            Details
                                        </button>
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