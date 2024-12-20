import React, { useState, useEffect } from "react";
import { getETicketByTicketCode } from "../../services/eticketApi";
import "../../assets/css/Eticket.css";

const Eticket = () => {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ticketCode = "TICKET123";

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const response = await getETicketByTicketCode(ticketCode);
        setTicketData(response);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin vé. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [ticketCode]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!ticketData) return <div>Không tìm thấy thông tin vé</div>;

  const [fromAirport, toAirport] = ticketData.fromTo.split(" -> ");

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
          <h3>{ticketData.reservationCode}</h3>
        </div>
      </header>

      <section className="flight-info">
        <div className="flight-details">
          <p className="flight-date">
            {ticketData.flightDate}
          </p>
          <div className="flight-route">
            <div>
              <p><strong>1011</strong></p>
              <p>{fromAirport}</p>
            </div>
            <div className="route-separator">&#8594;</div>
            <div>
              <p><strong>1221</strong></p>
              <p>{toAirport}</p>
            </div>
          </div>
          <p className="flight-airline">
            {ticketData.airline}
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
            <td>{ticketData.passenger.fullName}</td>
            <td>{`${fromAirport.split(' ')[0]} - ${toAirport.split(' ')[0]}`}</td>
            <td>{ticketData.amenities}</td>
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
              <td>{ticketData.passenger.fullName}</td>
              <td>{ticketData.fromTo.replace(' -> ', ' - ')}</td>
              <td>{ticketData.passenger.ticketCode}</td>
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