import axios from "axios";

const API_URL = "http://localhost:5000/api/Flight";

const flightService = {
  getAllFlights: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  getFlightById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
  createFlight: async (flight) => {
    const response = await axios.post(API_URL, flight);
    return response.data;
  },
  updateFlight: async (id, flight) => {
    await axios.put(`${API_URL}/${id}`, flight);
  },
  deleteFlight: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
};

export default flightService;
