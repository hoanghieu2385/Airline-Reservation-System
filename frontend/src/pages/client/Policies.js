
import React, { useState } from 'react';
import '../../assets/css/Policies.css';

const Policies = () => {
    const [content, setContent] = useState(
        'Chọn một điều khoản từ menu để xem nội dung tại đây.'
    );

    // Nội dung của các điều khoản
    const contentMap = {
        content1: `
        <h3>Điều Kiện Sử Dụng Cookies</h3>
        <p>Cookies là gì?</p>
        <p>Cookies là số nhận dạng chữ được tải xuống và lưu trữ trên ổ cứng máy tính của Quý khách khi Quý khách truy cập Website. Mỗi khi Quý khách truy cập lại Website, hệ thống của Vietnam Airlines có thể nhận dạng thiết bị của Quý khách, lưu thông tin về lượt truy cập, khách truy cập và tự động đăng nhập khi cần thiết. Vietnam Airlines sử dụng cookies để giúp Quý khách truy cập Website dễ dàng hơn.</p>
        <p>Cookies có thể được dùng để cá nhân hóa việc sử dụng Website, ví dụ:</p>
        <ul>
            <li>Hiển thị cài đặt điều hướng liên quan;</li>
            <li>Ghi nhớ tùy chọn của khách truy cập;</li>
            <li>Giúp người sử dụng trải nghiệm tốt hơn;</li>
            <li>Hạn chế số lượng quảng cáo được hiển thị.</li>
        </ul>
        <p>Bằng cách nhấp vào "Đồng ý" khi thông báo cookies hiển thị, Quý khách đồng ý cho cookies được đặt và đọc trên website www.vietnamairlines.com và các tên miền phụ liên kết.</p>
        <h4>Vietnam Airlines sử dụng cookies trên Website như thế nào?</h4>
        <p>Website Vietnam Airlines sử dụng các loại cookies khác nhau cho những mục đích chính sau:</p>
        <ul>
            <li>Cookies thiết yếu</li>
            <li>Cookies chức năng</li>
            <li>Cookies hiệu suất và phân tích</li>
            <li>Cookies cá nhân hóa</li>
            <li>Cookies tiếp thị và quảng cáo</li>
        </ul>
        <h4>Bảo mật dữ liệu</h4>
        <p>Vietnam Airlines cam kết đảm bảo bảo mật dữ liệu của Quý khách. Theo đó, Vietnam Airlines tuân thủ hai nguyên tắc sau:</p>
        <ul>
            <li>Vietnam Airlines không đính kèm bất kỳ thông tin nào vào cookies được sử dụng để nhận dạng cá nhân.</li>
            <li>Vietnam Airlines không cung cấp bất kỳ thông tin cá nhân nào của Quý khách cho các nhà quảng cáo hoặc bên thứ ba chạy quảng cáo cho Vietnam Airlines.</li>
        </ul>
    `,
        content2: '<h3>Điều Khoản 2</h3><p>Đây là nội dung của Điều Khoản 2.</p>',
        content3: '<h3>Điều Khoản 3</h3><p>Đây là nội dung của Điều Khoản 3.</p>',
    };

    // Hàm xử lý khi chọn menu item
    const handleContentChange = (contentId) => {
        setContent(contentMap[contentId] || '<p>Nội dung không tìm thấy.</p>');
    };

    return (
        <div className="policies-container">
            {/* Dropdown menu */}
            <div className="custom-dropdown">
                <button className="custom-dropdown-button">
                    Các Điều Kiện & Điều Khoản
                </button>
                <div className="custom-dropdown-content">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleContentChange('content1');
                        }}
                    >
                        Điều Khoản 1
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleContentChange('content2');
                        }}
                    >
                        Điều Khoản 2
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleContentChange('content3');
                        }}
                    >
                        Điều Khoản 3
                    </a>
                </div>
            </div>

            {/* Card hiển thị nội dung */}
            <div className="card">
                <div
                    className="custom-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
};

export default Policies;
