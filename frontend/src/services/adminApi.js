import api from "./api";
export const getUsers = () => api.get("/admin/users");
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

export const getAirlines = () => api.get("/Airline");
export const addAirline = (data) => api.post("/Airline/CreateAirline", data);
export const updateAirline = (airlineId, data) => api.put(`/Airline/${airlineId}`, data);
export const deleteAirline = (airlineId) => api.delete(`/Airline/${airlineId}`);

export const getAirports = () => api.get("/Airport");
export const addAirport = (data) => api.post("Airport/CreateAirport", data);
export const updateAirport = (airportId, data) => api.put(`/Airport/${airportId}`, data);
export const deleteAirport = (airportId) => api.delete(`/Airport/${airportId}`);

export const getCities = () => api.get("/City");
export const addCity = (data) => api.post("/City", data);
export const updateCity = (cityId, data) => api.put(`/City/${cityId}`, data);
export const deleteCity = (cityId) => api.delete(`/City/${cityId}`);
