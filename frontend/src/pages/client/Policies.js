// src/pages/Policies.js
import React from 'react';
import '../../assets/css/Policies.css';

const Policies = () => {
    return (
        <div className="policies-container">
            <header className="policies-header">
                <h1>Chính Sách & Điều Kiện</h1>
            </header>

            <nav className="policies-nav">
                <div className="dropdown">
                    <button className="dropdown-button">Danh Mục Chính Sách</button>
                    <div className="dropdown-content">
                        <a href="#dieu-kien-dat-ve">Điều Kiện Đặt Vé Trực Tuyến</a>
                        <a href="#dieu-kien-dieu-khoan">Các Điều Kiện & Điều Khoản</a>
                        <a href="#vnaholidays">Điều Kiện Đặt Gói VNAHolidays</a>
                        <a href="#cookies">Điều Kiện Sử Dụng Cookies</a>
                        <a href="#bao-mat">Bảo Mật Thông Tin</a>
                        <a href="#quy-che">Quy Chế Hoạt Động Sàn TMĐT</a>
                    </div>
                </div>
            </nav>

            <main className="policies-main">
                <div id="dieu-kien-dat-ve">
                    <h2>Điều Kiện Đặt Vé Trực Tuyến</h2>
                    <p>Tiêu chí và điều kiện sử dụng hệ thống mua vé trực tuyến tại website và ứng dụng di động.</p>
                </div>
                <div id="dieu-kien-dieu-khoan">
                    <h2>Các Điều Kiện & Điều Khoản</h2>
                    <p>Điều kiện và điều khoản áp dụng cho tất cả các giao dịch trực tuyến.</p>
                </div>
                <div id="vnaholidays">
                    <h2>Điều Kiện Đặt Gói VNAHolidays</h2>
                    <p>Điều kiện áp dụng cho việc đặt các gói du lịch VNAHolidays.</p>
                </div>
                <div id="cookies">
                    <h2>Điều Kiện Sử Dụng Cookies</h2>
                    <p>Chi tiết về cách sử dụng cookies trên website.</p>
                </div>
                <div id="bao-mat">
                    <h2>Bảo Mật Thông Tin</h2>
                    <p>Chính sách bảo mật và quyền riêng tư của khách hàng.</p>
                </div>
                <div id="quy-che">
                    <h2>Quy Chế Hoạt Động Sàn TMĐT</h2>
                    <p>Quy chế hoạt động của sàn giao dịch thương mại điện tử.</p>
                </div>
            </main>
        </div>
    );
};

export default Policies;
