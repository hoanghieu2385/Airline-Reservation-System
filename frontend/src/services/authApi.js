import api from './api';

export const login = async (credentials) => {
    const response = await api.post(`/User/login`, credentials);
    return response.data;
};

export const register = async (userDetails) => {
    const response = await api.post(`/User/register`, userDetails); 
    return response.data;
};
