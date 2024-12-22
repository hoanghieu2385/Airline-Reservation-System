import React, { useState, useEffect } from "react";
import "../../assets/css/Checkout.css";

const fetchFlightById = async (flightId) => {
  try {
    const response = await fetch(`https://localhost:7238/api/Flight/${flightId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching flight:", error);
    throw new Error("Failed to fetch flight data");
  }
};

const fetchPricingRules = async () => [
  { daysBeforeDeparture: 30, multiplier: 1.0 },
  { daysBeforeDeparture: 15, multiplier: 1.25 },
  { daysBeforeDeparture: 7, multiplier: 1.5 },
];

const CustomerDetail = () => {
  const [flightDetails, setFlightDetails] = useState(null);
  const [pricingRules, setPricingRules] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [baggagePrice, setBaggagePrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [gender, setGender] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const flightId = localStorage.getItem("selectedFlightId");
        if (!flightId) {
          throw new Error("No flight selected. Please select a flight first.");
        }

        const flightData = await fetchFlightById(flightId);
        const rules = await fetchPricingRules();

        setPricingRules(rules);
        setFlightDetails({ departure: flightData, return: null });

        const calculatedPrice = calculateTotalPrice(
          { departure: flightData, return: { basePrice: 0, departureTime: new Date() } },
          rules,
          baggagePrice
        );
        setTotalPrice(calculatedPrice);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [baggagePrice]);

  const calculateMultiplier = (departureDate, rules) => {
    const today = new Date();
    const departure = new Date(departureDate);
    const daysBeforeDeparture = Math.ceil(
      (departure - today) / (1000 * 60 * 60 * 24)
    );
    return rules.find((rule) => daysBeforeDeparture <= rule.daysBeforeDeparture)?.multiplier || 1.0;
  };

  const calculateTotalPrice = (flights, rules, baggage) => {
    const departureMultiplier = calculateMultiplier(
      flights.departure.departureTime,
      rules
    );
    const departurePrice =
      flights.departure?.basePrice && departureMultiplier
        ? flights.departure.basePrice * departureMultiplier
        : 0;
    return Math.round(departurePrice + baggage - 5);
  };

  const handleBaggageChange = (e) => {
    setBaggagePrice(Number(e.target.value));
  };

  const handleProceedToPayment = () => {
    const contactInfo = {
      gender,
      firstName,
      lastName,
      email,
      phone,
      address,
      age,
    };

    const checkoutData = {
      flightDetails,
      baggagePrice,
      totalPrice,
      contactInfo,
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    window.location.href = "/payment";
  };

  if (loading) return <div className="text-center p-5">Loading flight information...</div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;
  if (!flightDetails || !flightDetails.departure) return <div className="alert alert-warning m-5">No flight information available</div>;

  return (
    <div className="container checkout-container my-5">
      <div className="row g-4">
        <div className="col-md-7">
          <section className="checkout-flight-info mb-4">
            <h4 className="text-primary">Flight Information</h4>
            <p><strong>Airline:</strong> {flightDetails.departure.airlineName}</p>
            <p><strong>Flight Number:</strong> {flightDetails.departure.flightNumber}</p>
            <p><strong>Departure Time:</strong> {new Date(flightDetails.departure.departureTime).toLocaleString()}</p>
            <p><strong>Class: </strong> {flightDetails.departure.seatClass}</p>
            <p><strong>Base Price:</strong> {flightDetails.departure.basePrice.toLocaleString()} USD</p>
          </section>

          <section className="checkout-baggage-info mb-4">
            <h4 className="text-primary">Select Baggage</h4>
            <select className="form-select" value={baggagePrice} onChange={handleBaggageChange}>
              <option value="0">No Baggage</option>
              <option value="10">Add 20kg - 10 USD</option>
              <option value="15">Add 30kg - 15 USD</option>
              <option value="20">Add 40kg - 20 USD</option>
              <option value="30">Add 50kg - 30 USD</option>
            </select>
          </section>

          <section className="checkout-customer-info mb-4">
            <h4 className="text-primary">Customer Information</h4>
            <form>
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="age" className="form-label">Age</label>
                <input
                  type="number"
                  id="age"
                  className="form-control"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <textarea
                  id="address"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  required
                />
              </div>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
            </form>
          </section>
        </div>

        <div className="col-md-5">
          <section className="checkout-pricing-summary p-3 bg-light border rounded sticky-top">
            <h4 className="text-primary mb-3">Price Summary</h4>
            <p>
              Outbound:{" "}
              <strong>
                {flightDetails.departure?.basePrice
                  ? (
                      flightDetails.departure.basePrice *
                      calculateMultiplier(flightDetails.departure.departureTime, pricingRules)
                    ).toLocaleString() + " USD"
                  : "N/A"}
              </strong>
            </p>
            <p>
              Baggage: <strong>{baggagePrice.toLocaleString()} USD</strong>
            </p>
            <p>Discount: <strong>5 USD</strong></p>
            <hr />
            <p className="checkout-total-price text-success fs-5 fw-bold">
              Total: {totalPrice.toLocaleString()} USD
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
