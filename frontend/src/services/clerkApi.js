import api from "./api";

// User Management APIs
export const getUsers = (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/user/read${queryString ? `?${queryString}` : ""}`);
};

export const getClerkProfile = async (clerkId) => {
    try {
        const response = await api.get(`/user/profile/`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch clerk profile:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch clerk profile');
    }
};

// Update clerk profile
export const updateClerk = async (userId, data) => {
    try {
        // Log the request data for debugging
        console.log('Update Clerk Request Data:', {
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
        console.error('Update Clerk Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        // Rethrow with more specific error message
        throw new Error(error.response?.data?.message || 'Failed to update Clerk profile');
    }
};

// Airline Management APIs
export const getAirlines = () => api.get("/Airline");

// Airport Management APIs
export const getAirports = () => api.get("/Airport");

// City Management APIs
export const getCities = () => api.get("/City");

// Flight Management APIs
export const getFlights = () => api.get("/Flight");
