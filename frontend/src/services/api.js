// src/services/api.js

// Base URL của API backend (thay bằng URL của ASP.NET Core Web API của bạn)
const BASE_URL = "http://localhost:3000/api";

// Hàm helper để gọi API (một nơi duy nhất quản lý cách gọi API)
const apiCall = async (url, method = "GET", body = null, headers = {}) => {
    const config = {
        method, // Phương thức HTTP: GET, POST, PUT, DELETE
        headers: {
            "Content-Type": "application/json", // Định nghĩa kiểu dữ liệu
            ...headers, // Nếu cần thêm headers như Authorization
        },
    };

    // Nếu có dữ liệu gửi lên (body), thêm vào request
    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        // Thực hiện gọi API
        const response = await fetch(`${BASE_URL}${url}`, config);

        // Nếu server trả lỗi, ném lỗi
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "API error");
        }

        // Trả về dữ liệu JSON
        return response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error; // Ném lỗi ra để xử lý phía trên
    }
};

// Xuất các hàm để sử dụng ở nơi khác
export default {
    get: (url, headers) => apiCall(url, "GET", null, headers),
    post: (url, body, headers) => apiCall(url, "POST", body, headers),
    put: (url, body, headers) => apiCall(url, "PUT", body, headers),
    delete: (url, headers) => apiCall(url, "DELETE", null, headers),
};
