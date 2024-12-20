import React, { useState, useEffect } from "react";
import "../../assets/css/Checkout.css";

// Mock API functions
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
  const [baggagePrice, setBaggagePrice] = useState(0);
  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
  });
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    phone: false,
    email: false,
    age: false,
    gender: false,
  });

  const baggageOptions = [
    { label: "Không chọn hành lý", price: 0 },
    { label: "Thêm 20kgs hành lý - 216,000 VND", price: 216000 },
    { label: "Thêm 30kgs hành lý - 324,000 VND", price: 324000 },
    { label: "Thêm 40kgs hành lý - 432,000 VND", price: 432000 },
    { label: "Thêm 50kgs hành lý - 594,000 VND", price: 594000 },
    { label: "Thêm 60kgs hành lý - 702,000 VND", price: 702000 },
    { label: "Thêm 70kgs hành lý - 810,000 VND", price: 810000 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const rules = await fetchPricingRules();
      const flights = await fetchFlightDetails();

      setPricingRules(rules);
      setFlightDetails(flights);

      const calculatedPrice = calculateTotalPrice(flights, rules, baggagePrice);
      setTotalPrice(calculatedPrice);
    };

    fetchData();
  }, [baggagePrice]);

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

  const calculateTotalPrice = (flights, rules, baggage) => {
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

    return Math.round(departurePrice + returnPrice + baggage - 20000);
  };

  const handleBaggageChange = (e) => {
    setBaggagePrice(Number(e.target.value));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
    setErrors({ ...errors, [name]: false }); // Reset error on change
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone.trim());

  const handleSubmit = () => {
    const newErrors = {
      firstName: !contactInfo.firstName.trim(),
      lastName: !contactInfo.lastName.trim(),
      phone: !validatePhone(contactInfo.phone),
      email: !validateEmail(contactInfo.email),
      age: isNaN(contactInfo.age) || contactInfo.age <= 0,
      gender: !contactInfo.gender,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((value) => !value)) {
      alert("Form submitted successfully!");
    }
  };

  if (!flightDetails) return <div>Loading...</div>;

  return (
    <div className="container checkout-container my-5">
      <div className="row g-4">
        {/* Left Column */}
        <div className="col-md-7">
          <section className="checkout-flight-info mb-4">
            <h4 className="text-primary">Thông tin chuyến bay</h4>
            <div className="mb-3">
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

          <section className="checkout-baggage-info mb-4">
            <h4 className="text-primary">Chọn hành lý</h4>
            <select
              className="form-select"
              value={baggagePrice}
              onChange={handleBaggageChange}
            >
              {baggageOptions.map((option, index) => (
                <option key={index} value={option.price}>
                  {option.label}
                </option>
              ))}
            </select>
          </section>

          <section className="checkout-passenger-info">
            <h4 className="text-primary">Thông tin hành khách</h4>
            <div className="mb-3">
              <input
                className={`form-control ${
                  errors.firstName ? "is-invalid" : ""
                }`}
                name="firstName"
                placeholder="First Name"
                value={contactInfo.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && (
                <div className="invalid-feedback">First Name is required</div>
              )}
            </div>
            <div className="mb-3">
              <input
                className={`form-control ${
                  errors.lastName ? "is-invalid" : ""
                }`}
                name="lastName"
                placeholder="Last Name"
                value={contactInfo.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && (
                <div className="invalid-feedback">Last Name is required</div>
              )}
            </div>
            <div className="mb-3">
              <select
                className={`form-select ${
                  errors.gender ? "is-invalid" : ""
                }`}
                name="gender"
                value={contactInfo.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
              </select>
              {errors.gender && (
                <div className="invalid-feedback">Gender is required</div>
              )}
            </div>
            <div className="mb-3">
              <input
                className={`form-control ${errors.age ? "is-invalid" : ""}`}
                name="age"
                placeholder="Age"
                type="number"
                value={contactInfo.age}
                onChange={handleInputChange}
              />
              {errors.age && (
                <div className="invalid-feedback">Age must be greater than 0</div>
              )}
            </div>
            <div className="mb-3">
              <input
                className={`form-control ${
                  errors.phone ? "is-invalid" : ""
                }`}
                name="phone"
                placeholder="Phone Number"
                value={contactInfo.phone}
                onChange={handleInputChange}
              />
              {errors.phone && (
                <div className="invalid-feedback">
                  Phone must be numeric and 10-15 digits
                </div>
              )}
            </div>
            <div className="mb-3">
              <input
                className={`form-control ${
                  errors.email ? "is-invalid" : ""
                }`}
                name="email"
                placeholder="Email"
                value={contactInfo.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <div className="invalid-feedback">Enter a valid email</div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="col-md-5">
          <section className="checkout-pricing-summary p-3 bg-light border rounded">
            <h4 className="text-primary mb-3">Tóm tắt giá</h4>
            <p>
              Chiều đi:{" "}
              <strong>
                {(
                  flightDetails.departure.basePrice *
                  calculateMultiplier(
                    flightDetails.departure.departureTime,
                    pricingRules
                  )
                ).toLocaleString()}{" "}
                VND
              </strong>
            </p>
            <p>
              Chiều về:{" "}
              <strong>
                {(
                  flightDetails.return.basePrice *
                  calculateMultiplier(
                    flightDetails.return.departureTime,
                    pricingRules
                  )
                ).toLocaleString()}{" "}
                VND
              </strong>
            </p>
            <p>Hành lý: <strong>{baggagePrice.toLocaleString()} VND</strong></p>
            <p>Giảm giá: <strong>20,000 VND</strong></p>
            <p className="checkout-total-price text-success fs-5 fw-bold">
              Tổng tiền: {totalPrice.toLocaleString()} VND
            </p>
          </section>

          <button className="btn btn-primary w-100 mt-4" onClick={handleSubmit}>
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
