// src/services/api.js
import axios from 'axios';

// Base URL của API backend
const BASE_URL = 'https://localhost:7238/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
