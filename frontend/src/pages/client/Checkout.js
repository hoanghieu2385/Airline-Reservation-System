import React, { useState, useEffect } from "react";
import "../../assets/css/Checkout.css";

// Mock API function
const fetchPricingRules = async () => {
  return [
    { daysBeforeDeparture: 30, multiplier: 1.0 },
    { daysBeforeDeparture: 15, multiplier: 1.25 },
    { daysBeforeDeparture: 7, multiplier: 1.5 },
  ];
};

const fetchFlightDetails = async () => {
  return {
    departure: {
      airline: "VietJet",
      flightCode: "VJ162",
      departureTime: "2024-12-29T22:05:00",
      basePrice: 1088000,
    },
    return: {
      airline: "Vietnam Airlines",
      flightCode: "VN787",
      departureTime: "2024-12-30T20:15:00",
      basePrice: 778040,
    },
  };
};

const Checkout = () => {
  const [flightDetails, setFlightDetails] = useState(null);
  const [pricingRules, setPricingRules] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [voucher, setVoucher] = useState("");
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const rules = await fetchPricingRules();
      const flights = await fetchFlightDetails();

      setPricingRules(rules);
      setFlightDetails(flights);

      const calculatedPrice = calculateTotalPrice(flights, rules);
      setTotalPrice(calculatedPrice);
    };

    fetchData();
  }, []);

  const calculateMultiplier = (departureDate, rules) => {
    const today = new Date();
    const departure = new Date(departureDate);
    const daysBeforeDeparture = Math.ceil(
      (departure - today) / (1000 * 60 * 60 * 24)
    );
    let multiplier = 1.0;

    for (const rule of rules.sort(
      (a, b) => a.daysBeforeDeparture - b.daysBeforeDeparture
    )) {
      if (daysBeforeDeparture <= rule.daysBeforeDeparture) {
        multiplier = rule.multiplier;
        break;
      }
    }
    return multiplier;
  };

  const calculateTotalPrice = (flights, rules) => {
    const departureMultiplier = calculateMultiplier(
      flights.departure.departureTime,
      rules
    );
    const returnMultiplier = calculateMultiplier(
      flights.return.departureTime,
      rules
    );

    const departurePrice = flights.departure.basePrice * departureMultiplier;
    const returnPrice = flights.return.basePrice * returnMultiplier;

    return Math.round(departurePrice + returnPrice - 20000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  if (!flightDetails) return <div>Loading...</div>;

  return (
    <div className="checkout-container">
      <div className="row">
        {/* Left Column */}
        <div className="col">
          <section className="flight-info">
            <h4>Thông tin chuyến bay</h4>
            <div>
              <h5>Chiều đi: {flightDetails.departure.airline}</h5>
              <p>Mã chuyến bay: {flightDetails.departure.flightCode}</p>
              <p>
                Thời gian:{" "}
                {new Date(
                  flightDetails.departure.departureTime
                ).toLocaleString()}
              </p>
              <p>
                Giá gốc: {flightDetails.departure.basePrice.toLocaleString()}{" "}
                VND
              </p>
            </div>
            <div>
              <h5>Chiều về: {flightDetails.return.airline}</h5>
              <p>Mã chuyến bay: {flightDetails.return.flightCode}</p>
              <p>
                Thời gian:{" "}
                {new Date(flightDetails.return.departureTime).toLocaleString()}
              </p>
              <p>
                Giá gốc: {flightDetails.return.basePrice.toLocaleString()} VND
              </p>
            </div>
          </section>

          <section className="passenger-info">
            <h4>Thông tin hành khách</h4>
            <input
              name="name"
              placeholder="Họ và tên"
              onChange={handleInputChange}
            />
            <input
              name="phone"
              placeholder="Số điện thoại"
              onChange={handleInputChange}
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
          </section>
        </div>

        {/* Right Column */}
        <div className="col">
          <section className="voucher-info">
            <h4>Voucher giảm giá</h4>
            <input
              placeholder="Nhập mã voucher"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
            />
          </section>

          <section className="pricing-summary">
            <h4>Tóm tắt giá</h4>
            <p>
              Chiều đi:{" "}
              {(
                flightDetails.departure.basePrice *
                calculateMultiplier(
                  flightDetails.departure.departureTime,
                  pricingRules
                )
              ).toLocaleString()}{" "}
              VND
            </p>
            <p>
              Chiều về:{" "}
              {(
                flightDetails.return.basePrice *
                calculateMultiplier(
                  flightDetails.return.departureTime,
                  pricingRules
                )
              ).toLocaleString()}{" "}
              VND
            </p>
            <p>Giảm giá: 20,000 VND</p>
            <p className="total-price">
              Tổng tiền: {totalPrice.toLocaleString()} VND
            </p>
          </section>
          <button>Tiếp tục</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
