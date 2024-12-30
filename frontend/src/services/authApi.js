import api from './api';

export const login = async (credentials) => {
    const response = await api.post(`/User/login`, credentials);
    if (response.data.token) {
        sessionStorage.setItem("authToken", response.data.token);
        sessionStorage.setItem("userProfile", JSON.stringify(response.data.user));
    }
    return response.data;
};

export const getUserProfile = async () => {
    const response = await api.get(`/User/profile`);
    return response.data;
};

export const register = async (userDetails) => {
    const response = await api.post(`/User/register`, userDetails);
    return response.data;
};
export const forgotPassword = async (data) => {
    try {
        const response = await api.post(`/User/forgot-password`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (data) => {
    const response = await api.post(`/User/reset-password`, data);
    return response.data;
};
