// src/pages/client/Eticket.js

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import '../../assets/css/Eticket.css';

const Eticket = () => {
    const [searchParams] = useSearchParams();
    const [customerInfo, setCustomerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerInfo = async () => {
            const reservationCode = searchParams.get('reservationCode');
            if (!reservationCode) {
                setError('Mã đặt chỗ không hợp lệ.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/ETicket/customerinfo/${reservationCode}`);
                console.log('API Response:', response.data); // Debugging
                setCustomerInfo(response.data);
            } catch (err) {
                console.error('Error fetching customer information:', err);
                setError(err.response?.data?.Message || 'Lỗi khi lấy thông tin khách hàng.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerInfo();
    }, [searchParams]);

    if (loading) return <p className="loading">Đang tải...</p>;
    if (error) return <p className="error">{error}</p>;

    // Kiểm tra sự tồn tại của các thuộc tính trước khi truy cập
    if (!customerInfo || !customerInfo.flightDetails) {
        return <p className="error">Cấu trúc dữ liệu nhận được không hợp lệ.</p>;
    }

    return (
        <div className="eticket-details">
            {/* Header Tùy chọn */}
            <div className="eticket-header">
                <img src="/path-to-your-logo.png" alt="Company Logo" className="logo" />
                <div className="date">Ngày: {new Date().toLocaleDateString()}</div>
                <h2>Chi tiết E-ticket</h2>
            </div>
            <div>
                <p><strong>Mã đặt chỗ:</strong> {customerInfo.reservationCode || 'N/A'}</p>
                <div className="flight-details">
                    <h3>Chi tiết chuyến bay:</h3>
                    <p><strong>Từ/Đến:</strong> {customerInfo.flightDetails.fromTo || 'N/A'}</p>
                    <p><strong>Hãng hàng không:</strong> {customerInfo.flightDetails.airline || 'N/A'}</p>
                    <p><strong>Ngày và giờ bay:</strong> {customerInfo.flightDetails.travelDate ? new Date(customerInfo.flightDetails.travelDate).toLocaleString() : 'N/A'}</p>
                    <p><strong>Tổng giá:</strong> ${customerInfo.flightDetails.totalPrice !== undefined ? customerInfo.flightDetails.totalPrice.toFixed(2) : 'N/A'}</p>
                </div>
                <div className="passengers">
                    <h3>Hành khách:</h3>
                    {customerInfo.passengers && customerInfo.passengers.length > 0 ? (
                        customerInfo.passengers.map((passenger, index) => (
                            <div key={index} className="passenger">
                                <p><strong>Tên:</strong> {passenger.fullName || 'N/A'}</p>
                                <p><strong>Tuổi:</strong> {passenger.age !== undefined ? passenger.age : 'N/A'}</p>
                                <p><strong>Giới tính:</strong> {passenger.gender || 'N/A'}</p>
                                <p><strong>Mã vé:</strong> {passenger.ticketCode || 'N/A'}</p>
                                <p><strong>Giá vé:</strong> ${passenger.ticketPrice !== undefined ? passenger.ticketPrice.toFixed(2) : 'N/A'}</p>
                            </div>
                        ))
                    ) : (
                        <p>Không tìm thấy hành khách.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Eticket;
