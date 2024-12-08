// src/services/clientApi.js
import api from "./api";

export const getFlights = () => api.get("/flights");
export const bookFlight = (flightId, data) => api.post(`/flights/${flightId}/book`, data);
export const cancelBooking = (bookingId) => api.delete(`/bookings/${bookingId}`);
