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


// Search flights based on query parameters
export const searchFlights = async (params) => {
    try {
        console.log('Fetching flights with params:', params);

        // Sử dụng params để truyền đúng dữ liệu tìm kiếm
        const response = await api.get('/Flight/Search', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching flights:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        throw new Error(error.response?.data?.message || 'Failed to fetch flights. Please try again.');
    }
};
