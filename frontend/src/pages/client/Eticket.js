// src/pages/client/ETicket.js
import React, { useState } from "react";
import { eticketAPI } from "../../services/eticketApi";
import "../../assets/css/Eticket.css";

const ETicket = () => {
    const [ticketCode, setTicketCode] = useState('');
    const [ticketData, setTicketData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const formatTicketCode = (code) => {
        return code.trim();
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!ticketCode) return;

        setLoading(true);
        setError('');
        setTicketData(null);

        try {
            const formattedCode = formatTicketCode(ticketCode);
            const response = await eticketAPI.getETicketByCode(formattedCode);
            
            if (response.data) {
                setTicketData(response.data);
            } else {
                setError('Ticket information not found.');
            }
        } catch (err) {
            console.error('Error fetching ticket:', err);
            setError(
                err.response?.data?.message || 
                'An error occurred while fetching the ticket. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    const renderTicketInfo = () => {
        if (!ticketData) return null;

        const { passenger, fromTo, flightDate, airline, amenities, reservationCode } = ticketData;
        
        return (
            <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden ticket-info">
                <div className="bg-blue-500 text-white p-4 ticket-header">
                    <h2 className="text-xl font-semibold">E-Ticket Information</h2>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Passenger Information
                            </h3>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Full Name:</span>
                                <span className="font-medium">{passenger.fullName}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Age:</span>
                                <span>{passenger.age}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Gender:</span>
                                <span>{passenger.gender}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Ticket Code:</span>
                                <span className="font-medium">{passenger.ticketCode}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Ticket Price:</span>
                                <span className="font-medium text-blue-600">
                                    {passenger.ticketPrice.toLocaleString('en-US')} VND
                                </span>
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg border-b pb-2">
                                Flight Information
                            </h3>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Route:</span>
                                <span className="font-medium">{fromTo}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Flight Date:</span>
                                <span>{flightDate}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Airline:</span>
                                <span>{airline}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Luggage:</span>
                                <span>{amenities}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Reservation Code:</span>
                                <span className="font-medium">{reservationCode}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="eticket-container">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">Flight Ticket Lookup</h1>
                
                <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={ticketCode}
                            onChange={(e) => setTicketCode(e.target.value)}
                            placeholder="Enter your ticket code (e.g., VN123TK001)"
                            className="w-full p-3 border rounded-lg search-input"
                            required
                        />
                        <button 
                            type="submit"
                            className="w-full bg-blue-500 text-white p-3 rounded-lg search-button hover:bg-blue-600"
                            disabled={loading || !ticketCode}
                        >
                            {loading ? 'Searching...' : 'Search Ticket'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="max-w-md mx-auto mb-8">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    </div>
                )}

                {ticketData && renderTicketInfo()}
            </div>
        </div>
    );
};

export default ETicket;
