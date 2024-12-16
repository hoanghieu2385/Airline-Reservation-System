// src/services/clientApi.js
import api from './api';

export const searchAirports = async (query) => {
    const response = await api.get(`/airport/search`, { params: { query } });
    return response.data;
};

export const getClientProfile = async () => {
    try {
        const response = await api.get('/user/read');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/user/profile');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch current user profile:', error);
        throw error;
    }
};