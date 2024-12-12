// src/pages/client/Eticket.js
import React from "react";
import "../../assets/css/Eticket.css"; // CSS file for styling

const Eticket = () => {
  return (
    <div className="eticket-container">
      <header className="eticket-header">
        <div className="eticket-logo">Logo</div>
        <div className="eticket-title">
          <h1>E-Ticket / Vé điện tử</h1>
          <h2>Departure Flight / Chuyến bay đi</h2>
        </div>
        <div className="eticket-booking">
          <p>Traveloka Booking ID</p>
          <h3>123456789</h3>
        </div>
      </header>

      <section className="flight-info">
        <div className="flight-details">
          <p className="flight-date">
            Wednesday, 9 October 2024 / Thứ Tư, 9 tháng 10 2024
          </p>
          <div className="flight-route">
            <div>
              <p>
                <strong>1011</strong>
              </p>
              <p>Hanoi (HAN)</p>
              <p>Noi Bai International Airport</p>
            </div>
            <div className="route-separator">&#8594;</div>
            <div>
              <p>
                <strong>1221</strong>
              </p>
              <p>Buon Ma Thuot (BMV)</p>
              <p>Buon Ma Thuot</p>
            </div>
          </div>
          <p className="flight-airline">
            Vietnam Airline
            <br />
            VN - 1603
            <br />
            Subclass M (Economy)
          </p>
        </div>
        <div className="flight-status">
          <p className="status-text">Được hoàn tiền</p>
        </div>
      </section>

      <div className="instructions">
        <div className="instruction-item">
          <img src="/path/to/icon-passport.png" alt="passport icon" />
          <p>Trình CMND/hộ chiếu và vé khi làm thủ tục bay</p>
        </div>
        <div className="instruction-item">
          <img src="/path/to/icon-clock.png" alt="clock icon" />
          <p>Làm thủ tục ít nhất <strong>90 phút</strong> trước giờ khởi hành</p>
        </div>
        <div className="instruction-item">
          <img src="/path/to/icon-airport.png" alt="airport icon" />
          <p>Giờ hiển thị trên vé là giờ sân bay địa phương</p>
        </div>
      </div>

      <table className="flight-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Passenger(s)</th>
            <th>Route</th>
            <th>Flight Facilities</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Name (Người lớn)</td>
            <td>HAN - BMV</td>
            <td>1 x 23 kg</td>
          </tr>
        </tbody>
      </table>

      <section className="passenger-info">
        <h3>Passenger Details / Thông tin khách hàng</h3>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Passenger(s) / Tên hành khách</th>
              <th>Route / Chặng</th>
              <th>Ticket Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Name (Người tên)</td>
              <td>Hà Nội - Buôn Ma Thuột</td>
              <td>7382446862279</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="reschedule-refund">
        <div className="how-to">
          <h3>How to Reschedule / Hướng dẫn thay đổi lịch bay</h3>
          <ol>
            {[...Array(9).keys()].map((step) => (
              <li key={step + 1}>{step + 1}</li>
            ))}
          </ol>
        </div>

        <div className="how-to">
          <h3>How to Refund / Hướng dẫn hoàn tiền</h3>
          <ol>
            {[...Array(9).keys()].map((step) => (
              <li key={step + 1}>{step + 1}</li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="eticket-footer">
        <p>
          LƯU Ý: Hãng hàng không chỉ chấp thuận yêu cầu hoàn tiền được xử lý
          thông qua _____
        </p>
      </footer>
    </div>
  );
};

export default Eticket;
