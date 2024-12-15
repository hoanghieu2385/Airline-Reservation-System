// src/services/clientApi.js
import api from './api';

export const searchAirports = async (query) => {
    const response = await api.get(`/airport/search`, { params: { query } });
    return response.data;
};
