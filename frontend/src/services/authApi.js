import api from './api';

export const login = async (credentials) => {
    const response = await api.post(`/User/login`, credentials);
    if (response.data.token) {
        sessionStorage.setItem("authToken", response.data.token);
        sessionStorage.setItem("userProfile", JSON.stringify(response.data.user));
    }
    return response.data;
};


// Thêm hàm để lấy thông tin user
export const getUserProfile = async () => {
    const response = await api.get(`/User/profile`);
    return response.data;
};

export const register = async (userDetails) => {
    const response = await api.post(`/User/register`, userDetails);
    return response.data;
};
