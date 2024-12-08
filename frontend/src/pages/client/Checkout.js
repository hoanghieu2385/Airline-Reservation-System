// File: src/pages/Checkout.js
import React from 'react';
import '../../assets/css/Checkout.css';

const Checkout = () => {
    return (
        <div className="container">
            <h2 className="text-center mb-4">Đặt Vé Máy Bay</h2>

            {/* Thông tin chuyến bay */}
            <section className="card">
                <div className="card-header">Thông tin chuyến bay</div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h5>Chiều đi</h5>
                            <p><b>Hãng:</b> VietJet</p>
                            <p><b>Mã chuyến bay:</b> VJ162</p>
                            <p><b>Thời gian:</b> 22:05, 20/12/2024</p>
                        </div>
                        <div className="col-md-6">
                            <h5>Chiều về</h5>
                            <p><b>Hãng:</b> Vietnam Airlines</p>
                            <p><b>Mã chuyến bay:</b> VN787</p>
                            <p><b>Thời gian:</b> 20:15, 28/12/2024</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Thông tin hành khách */}
            <section className="card">
                <div className="card-header">Thông tin hành khách</div>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="fullname" className="form-label">Họ và tên</label>
                            <input type="text" className="form-control" id="fullname" placeholder="Nguyễn Văn A" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="idNumber" className="form-label">Số CCCD/Passport</label>
                            <input type="text" className="form-control" id="idNumber" placeholder="123456789" />
                        </div>
                    </form>
                </div>
            </section>

            {/* Thông tin hành lý */}
            <section className="card">
                <div className="card-header">Thông tin hành lý</div>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="luggage" className="form-label">Hành lý (kg)</label>
                            <select className="form-select" id="luggage">
                                <option value="0">Không chọn hành lý</option>
                                <option value="20">20kg</option>
                                <option value="30">30kg</option>
                            </select>
                        </div>
                    </form>
                </div>
            </section>

            {/* Voucher giảm giá */}
            <section className="card">
                <div className="card-header">Voucher giảm giá</div>
                <div className="card-body">
                    <form>
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Nhập mã voucher" />
                            <button className="btn btn-primary">Áp dụng</button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Tổng kết */}
            <section className="summary-box">
                <h4>Tổng giá trị</h4>
                <p><b>Chiều đi:</b> 1,584,600 VND</p>
                <p><b>Chiều về:</b> 1,766,040 VND</p>
                <p className="total-price">Tổng tiền: 3,350,640 VND</p>
            </section>

            <button className="btn btn-primary w-100">Tiếp tục</button>
        </div>
    );
};

export default Checkout;
