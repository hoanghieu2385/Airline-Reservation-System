import React, { useState } from 'react';
import '../../assets/css/Policies.css';

const Policies = () => {
    const [content, setContent] = useState(
        'Chọn một điều khoản từ menu để xem nội dung tại đây.'
    );

    // Nội dung của các điều khoản
    const contentMap = {
        content1: `<ul>
            <li>Hiển thị cài đặt điều hướng liên quan;</li>
            <li>Ghi nhớ tùy chọn của khách truy cập;</li>
            <li>Giúp người sử dụng trải nghiệm tốt hơn;</li>
            <li>Hạn chế số lượng quảng cáo được hiển thị.</li>
        </ul>
        <p>Bằng cách nhấp vào Đồng ý khi thông báo cookies hiển thị, Quý khách đồng ý cho cookies được đặt và đọc trên website www.vietnamairlines.com và các tên miền phụ liên kết.</p>
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
        </ul>`,
        content2: `<h3>Tiêu chí và điều kiện sử dụng hệ thống mua vé trực tuyến</h3>
        <p>a. Phạm vi áp dụng</p>
        <p>Điều kiện dưới đây áp dụng riêng cho chức năng mua vé trực tuyến tại Website và Ứng dụng di động. Khi sử dụng chức năng để đặt chỗ, mua vé và các sản phẩm bổ trợ, Quý khách mặc nhiên đã chấp thuận và tuân thủ tất cả các chỉ dẫn, điều khoản, điều kiện, những lưu ý được đăng tải trên Website và Ứng dụng di động, bao gồm nhưng không giới hạn bởi Điều kiện Sử dụng nêu ở đây. Nếu Quý khách không có ý định mua vé trực tuyến hay không đồng ý với bất kỳ điều khoản hay điều kiện nào nêu trong Điều kiện Sử dụng, xin hãy DỪNG VIỆC SỬ DỤNG chức năng này.</p>
        <p>b. Điều kiện sử dụng tính năng mua vé trực tuyến</p>
        <ul>
            <li>Tính năng mua vé trực tuyến chỉ sử dụng cho mục đích cá nhân và phi thương mại.</li>
            <li>Quý khách phải khẳng định và bảo đảm rằng Quý khách đã đủ tuổi khi sử dụng chức năng này...</li>
        </ul>
        <h4>d. Quy định giá vé và các khoản phí</h4>
        <p>Tổng số tiền thanh toán đã bao gồm các thuế, phí hành khách phải trả...</p>`,
        content3: `<h3>Thông tin dữ liệu</h3>
        <p>1. Dữ liệu cơ bản</p>
        <ul>
            <li>Tên, số hộ chiếu và các thông tin nhận dạng khác.</li>
            <li>Thông tin liên lạc và tài khoản cá nhân hoặc thông tin đăng ký.</li>
            <li>Thông tin về tài khoản số của cá nhân.</li>
            <li>Thông tin về thanh toán.</li>
            <li>Thông tin về giữ chỗ, đặt vé và mua vé.</li>
        </ul>
        <p>2. Dữ liệu nhạy cảm</p>
        <p>Vietnam Airlines có thể thu thập một số thông tin về tình trạng sức khỏe...</p>`
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
