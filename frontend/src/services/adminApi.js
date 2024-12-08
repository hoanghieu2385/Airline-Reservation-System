// src/services/adminApi.js
import api from "./api";

// Hàm lấy danh sách người dùng
export const getUsers = () => api.get("/admin/users");

// Hàm xóa người dùng
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

// Hàm thêm chuyến bay
export const addFlight = (data) => api.post("/admin/flights", data);
