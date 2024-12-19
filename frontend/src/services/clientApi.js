// src/services/clientApi.js
import api from './api';

export const searchAirports = async (query) => {
    const response = await api.get(`/airport/search`, { params: { query } });
    return response.data;
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

// Update user profile
export const updateUser = async (userId, data) => {
    try {
        // Log the request data for debugging
        console.log('Update User Request Data:', {
            userId,
            data
        });

        // Map the frontend property names to match backend DTO
        const mappedData = {
            firstName: data.firstName || undefined,
            lastName: data.lastName || undefined,
            address: data.address || undefined,
            phoneNumber: data.phone || undefined,  // Changed from phoneNumber to match frontend
            dateOfBirth: data.dateOfBirth || undefined,
            preferredCreditCard: data.preferredCreditCard || undefined,
            newPassword: data.newPassword || undefined,
            confirmPassword: data.confirmPassword || undefined
        };

        // Remove undefined values
        const cleanedData = Object.fromEntries(
            Object.entries(mappedData).filter(([_, value]) => value !== undefined && value !== '')
        );

        console.log('Cleaned request payload:', cleanedData);

        const response = await api.put(`/user/update/${userId}`, cleanedData);
        return response.data;
    } catch (error) {
        // Enhanced error logging
        console.error('Update User Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        // Rethrow with more specific error message
        throw new Error(error.response?.data?.message || 'Failed to update user profile');
    }
};

// Change user password
export const changePassword = async (userId, passwords) => {
    try {
        const response = await api.put(`/user/security/${userId}`, passwords);
        return response.data;
    } catch (error) {
        console.error('Failed to change password:', error);
        throw error;
    }
};