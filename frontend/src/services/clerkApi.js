// src/services/clerkApi.js
import api from "./api";

// Hàm lấy danh sách người dùng
export const getUsers = () => api.get("/clerk/users");

// Hàm xóa người dùng
export const deleteUser = (userId) => api.delete(`/clerk/users/${userId}`);

// Hàm thêm chuyến bay
export const addFlight = (data) => api.post("/clerk/flights", data);
