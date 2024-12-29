import api from "./api";

// User Management APIs
export const getUsers = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/user/read${queryString ? `?${queryString}` : ""}`);
};
export const updateUser = (userId, data) => api.put(`/user/admin-update-user/${userId}`, data);

// Airline Management APIs
export const getAirlines = () => api.get("/Airline");

// Airport Management APIs
export const getAirports = () => api.get("/Airport");

// City Management APIs
export const getCities = () => api.get("/City");

// Flight Management APIs
export const getFlights = () => api.get("/Flight");
