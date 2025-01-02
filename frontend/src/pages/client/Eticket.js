// src/pages/client/Eticket.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import '../../assets/css/Eticket.css';
import Logo from '../../assets/images/Logo.png';

const Eticket = () => {
    const [searchParams] = useSearchParams();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerInfo = async () => {
            const reservationCode = searchParams.get('reservationCode');
            if (!reservationCode) {
                setError('Invalid reservation code.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/ETicket/customerinfo/${reservationCode}`);
                setCustomerInfo(response.data);
            } catch (err) {
                console.error('Error fetching customer information:', err);
                setError(err.response?.data?.Message || 'Error fetching customer information.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerInfo();
    }, [searchParams]);

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    if (!customerInfo || !customerInfo.flightDetails) {
        return <p className="error">No flight details available.</p>;
    }

    const { flightDetails, reservationCode, passengers } = customerInfo;

    return (
        <div className="eticket-container container p-4">
            {/* Header */}
            <div className="eticket-header d-flex justify-content-between align-items-center mb-4">
                <img src={Logo} alt="Company Logo" className="eticket-logo" />
                <div>
                    <h5>Reservation Code:</h5>
                    <p>{reservationCode || 'N/A'}</p>
                </div>
            </div>

            {/* Flight Details */}
            <div className="eticket-flight-details card p-3 mb-4">
                <h3 className="eticket-section-title">Flight Details</h3>
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                        <p><strong>Airline:</strong> {flightDetails.airline || 'N/A'}</p>
                        <p><strong>Flight Date and Time:</strong> {flightDetails.travelDate ? new Date(flightDetails.travelDate).toLocaleString() : 'N/A'}</p>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                        <p><strong>From:</strong> {flightDetails.fromTo?.split(' -> ')[0]}</p>
                        <p><strong>To:</strong> {flightDetails.fromTo?.split(' -> ')[1]}</p>
                    </div>
                </div>
                <p><strong>Total Price:</strong> ${flightDetails.totalPrice?.toFixed(2) || 'N/A'}</p>
            </div>
            
            {/* Important Notice */}
            <div className="eticket-notice card p-3 mb-4">
                <div className="row text-center align-items-center">
                    <div className="col-md-4">
                        <i className="fas fa-id-card eticket-notice-icon"></i>
                        <p>Present your ID/passport and ticket when checking in</p>
                    </div>
                    <div className="col-md-4">
                        <i className="fas fa-clock eticket-notice-icon"></i>
                        <p>Check-in at least 90 minutes before departure</p>
                    </div>
                    <div className="col-md-4">
                        <i className="fas fa-exclamation-triangle eticket-notice-icon"></i>
                        <p>The time shown on the ticket is the local airport time</p>
                    </div>
                </div>
            </div>

            {/* Passengers */}
            <div className="eticket-passengers card p-3">
                <h3 className="eticket-section-title">Passengers</h3>
                {passengers && passengers.length > 0 ? (
                    <div className="eticket-passenger-list">
                        {passengers.map((passenger, index) => (
                            <div key={index} className="eticket-passenger-item">
                                <p><strong>Name:</strong> {passenger.fullName || 'N/A'}</p>
                                <p><strong>Gender:</strong> {passenger.gender || 'N/A'}</p>
                                <p><strong>Ticket Code:</strong> {passenger.ticketCode || 'N/A'}</p>
                                <p><strong>Ticket Price:</strong> ${passenger.ticketPrice?.toFixed(2) || 'N/A'}</p>
                                {index < passengers.length - 1 && <hr className="eticket-passenger-divider" />}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No passengers found.</p>
                )}
            </div>
        </div>
    );
};

export default Eticket;