import api from "./api";
// User Management APIs
export const getUsers = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/user/read${queryString ? `?${queryString}` : ""}`);
};
export const addUser = (data) => api.post("/user/admin-create-user", data);
export const updateUser = (userId, data) => api.put(`/user/admin-update-user/${userId}`, data);
export const deleteUser = (userId) => api.delete(`/user/delete/${userId}`);
// Change admin password
export const changePassword = async (userId, data) => {
    try {
        // Map the formData to match the backend's UpdateUserDto
        const payload = {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
        };

        console.log("Change Password Payload:", payload);

        // Send request to the existing update endpoint
        const response = await api.put(`/user/update/${userId}`, payload);

        return response.data;
    } catch (error) {
        console.error("Change Password Error Details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });

        throw new Error(error.response?.data?.message || "Failed to change password");
    }
};

// Airline Management APIs
export const getAirlines = () => api.get("/Airline");
export const addAirline = (data) => api.post("/Airline/CreateAirline", data);
export const updateAirline = (airlineId, data) => api.put(`/Airline/${airlineId}`, data);
export const deleteAirline = (airlineId) => api.delete(`/Airline/${airlineId}`);

// Airport Management APIs
export const getAirports = () => api.get("/Airport");
export const addAirport = (data) => api.post("/Airport/CreateAirport", data);
export const updateAirport = (airportId, data) => {
    return api.put(`/Airport/${airportId}`, {
        AirportId: airportId,
        airportCode: data.airportCode,
        airportName: data.airportName,
        cityId: data.cityId,
    });
};
export const deleteAirport = (airportId) => api.delete(`/Airport/${airportId}`);

// City Management APIs
export const getCities = () => api.get("/City");
export const addCity = (data) => api.post("/City", data);
export const updateCity = (cityId, data) => api.put(`/City/${cityId}`, data);
export const deleteCity = (cityId) => api.delete(`/City/${cityId}`);

// Flight Management APIs
export const getFlights = () => api.get("/Flight");
export const getFlightById = (id) => api.get(`/Flight/${id}`);
export const searchFlights = (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/Flight/Search${queryString ? `?${queryString}` : ""}`);
};
export const createFlight = (data) => api.post("/Flight", data);
export const updateFlight = (id, data) => api.put(`/Flight/${id}`, data);
export const deleteFlight = (flightId) =>
    api.delete(`/Flight/${flightId}`);

// Flight Seat Allocation APIs
export const getSeatAllocationsByFlightId = (flightId) => api.get(`/FlightSeatAllocation/${flightId}`);
export const addSeatAllocation = (data) => api.post("/FlightSeatAllocation", data);
export const updateSeatAllocation = (id, data) => api.put(`/FlightSeatAllocation/${id}`, data);
export const deleteSeatAllocation = (id) => api.delete(`/FlightSeatAllocation/${id}`);

// Reservation Management APIs
export const getReservations = () => api.get("/Reservations");
export const searchReservations = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/Reservations/Search${queryString ? `?${queryString}` : ""}`);
};
export const finalizeReservation = (data) => api.post("/Reservations/FinalizeReservation", data);
export const updateReservation = (id, data) => api.put(`/Reservations/${id}`, data);
export const deleteReservation = (id) => api.delete(`/Reservations/${id}`);

// FlightRoute Management APIs
export const searchAirports = async (query) => {
    const response = await api.get(`/airport/search`, { params: { query } });
    return response.data;
};
export const getFlightRoutes = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/FlightRoute${queryString ? `?${queryString}` : ""}`);
};
export const getFlightRouteById = (id) => api.get(`/FlightRoute/${id}`);
export const addFlightRoute = (data) => api.post("/FlightRoute", data);
export const updateFlightRoute = (id, data) => api.put(`/FlightRoute/${id}`, data);
export const deleteFlightRoute = (id) => api.delete(`/FlightRoute/${id}`);
