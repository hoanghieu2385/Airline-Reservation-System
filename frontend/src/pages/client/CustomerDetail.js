import React, { useState, useEffect } from "react";
import "../../assets/css/Checkout.css";

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const fetchFlightById = async (flightId) => {
  try {
    const response = await fetch(
      `https://localhost:7238/api/Flight/${flightId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Flight Details Response:", data); // Debugging log
    return data;
  } catch (error) {
    console.error("Error fetching flight:", error);
    throw new Error("Failed to fetch flight data");
  }
};

const fetchAllocationId = async (flightId, airlineId, seatClass) => {
  try {
    const response = await fetch(
      `https://localhost:7238/api/SeatClass/GetAllocationId?flightId=${flightId}&airlineId=${airlineId}&className=${seatClass}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch allocation ID.");
    }
    const allocationId = await response.json();
    return allocationId;
  } catch (error) {
    console.error("Error fetching allocation ID:", error);
    return null;
  }
};

const fetchPriceMultiplier = async (daysBeforeDeparture) => {
  const url = `https://localhost:7238/api/PricingRule/multiplier/${daysBeforeDeparture}`;
  console.log("Fetching Pricing Rule Multiplier from:", url); // Log the correct URL
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Error fetching price multiplier: ${response.status} ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const multiplier = await response.json();
    console.log("Fetched Pricing Rule Multiplier:", multiplier); // Log the fetched multiplier
    return multiplier;
  } catch (error) {
    console.error("Error in fetchPriceMultiplier:", error);
    return 1.0; // Default multiplier
  }
};

const fetchBasePriceMultiplier = async (airlineId, seatClass) => {
  try {
    const response = await fetch(
      `https://localhost:7238/api/SeatClass/multiplier?airlineId=${airlineId}&className=${seatClass}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const multiplier = await response.json();
    console.log("Base Price Multiplier Response:", multiplier); // Debugging log
    return multiplier;
  } catch (error) {
    console.error("Error fetching base price multiplier:", error);
    return 1.0; // Default multiplier
  }
};

const CustomerDetail = () => {
  const [flightDetails, setFlightDetails] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [baggagePrice, setBaggagePrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [gender, setGender] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const selectedFlight = JSON.parse(
          sessionStorage.getItem("selectedFlight")
        );
        console.log("Retrieved Selected Flight:", selectedFlight); // Debugging log

        if (
          !selectedFlight ||
          !selectedFlight.flightId ||
          !selectedFlight.allocationId
        ) {
          throw new Error(
            "No flight or seat allocation selected. Please select a flight."
          );
        }

        const { flightId, seatClass } = selectedFlight;

        const flightData = await fetchFlightById(flightId);

        const allocationId = await fetchAllocationId(flightId, flightData.airlineId, seatClass);

        const basePriceMultiplier = await fetchBasePriceMultiplier(
          flightData.airlineId,
          seatClass
        );

        if (!allocationId) {
            throw new Error("Failed to fetch allocation ID.");
        }

        console.log("Airline ID:", flightData.airlineId);
        console.log("Selected Seat Class:", seatClass);
        console.log("Allocation ID:", allocationId);

        const departureDate = new Date(flightData.departureTime);
        const today = new Date();
        const daysBeforeDeparture = Math.ceil(
          (departureDate - today) / (1000 * 60 * 60 * 24)
        );

        console.log("Calculated daysBeforeDeparture:", daysBeforeDeparture);

        const priceMultiplier = await fetchPriceMultiplier(daysBeforeDeparture);

        console.log("Base Price Multiplier:", basePriceMultiplier);
        console.log("Pricing Rule Multiplier:", priceMultiplier);

        const calculatedPrice = calculateTotalPrice(
          flightData.basePrice,
          basePriceMultiplier,
          priceMultiplier,
          baggagePrice
        );

        setFlightDetails({
          ...flightData,
          allocationId,
          basePriceMultiplier,
          priceMultiplier,
          seatClass,
        });
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

  const calculateTotalPrice = (
    basePrice,
    basePriceMultiplier,
    priceMultiplier,
    baggage
  ) => {
    console.log("Calculating Total Price with:", {
      basePrice,
      basePriceMultiplier,
      priceMultiplier,
      baggage,
    }); // Debugging log

    if (
      isNaN(basePrice) ||
      isNaN(basePriceMultiplier) ||
      isNaN(priceMultiplier)
    ) {
      return 0; // Fallback for invalid values
    }
    return Math.round(
      basePrice * basePriceMultiplier * priceMultiplier + baggage
    );
  };

  const handleBaggageChange = (e) => {
    setBaggagePrice(Number(e.target.value));
  };

  const handleProceedToPayment = () => {
    if (!firstName || !lastName || !email || !phone) {
      alert(
        "Please fill in all customer information fields before proceeding."
      );
      return;
    }

    const contactInfo = {
      gender,
      firstName,
      lastName,
      email,
      phone,
    };

    const checkoutData = {
      flightDetails: {
        ...flightDetails,
        allocationId: flightDetails.allocationId || null, // Add allocationId if available
      },
      baggagePrice,
      totalPrice,
      contactInfo,
    };

    const passengers = [
      {
        firstName,
        lastName,
        gender,
        email,
        phoneNumber: phone,
      },
    ];

    sessionStorage.setItem("passengers", JSON.stringify(passengers));
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    window.location.href = "/payment";
  };

  if (loading)
    return <div className="text-center p-5">Loading flight information...</div>;
  if (error) return <div className="alert alert-danger m-5">{error}</div>;
  if (!flightDetails)
    return (
      <div className="alert alert-warning m-5">
        No flight information available
      </div>
    );

  return (
    <div className="container checkout-container my-5">
      <div className="row g-4">
        <div className="col-md-7">
          <section className="checkout-flight-info mb-4">
            <h4 className="text-primary">Flight Information</h4>
            <p>
              <strong>Airline:</strong> {flightDetails.airlineName}
            </p>
            <p>
              <strong>Flight Number:</strong> {flightDetails.flightNumber}
            </p>
            <p>
              <strong>Departure Time:</strong>{" "}
              {formatDate(flightDetails.departureTime)}
            </p>
            <p>
              <strong>Class: </strong> {flightDetails.seatClass}
            </p>
          </section>

          <section className="checkout-baggage-info mb-4">
            <h4 className="text-primary">Select Baggage</h4>
            <select
              className="form-select"
              value={baggagePrice}
              onChange={handleBaggageChange}
            >
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
                <label htmlFor="gender" className="form-label">
                  Title
                </label>
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
                <label htmlFor="firstName" className="form-label">
                  First name/middle name according to passport
                </label>
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
                <label htmlFor="lastName" className="form-label">
                  Last name according to passport
                </label>
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
                <label htmlFor="email" className="form-label">
                  Email
                </label>
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
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
              Outbound Price:{" "}
              <strong>
                {(
                  flightDetails.basePrice *
                  flightDetails.basePriceMultiplier *
                  flightDetails.priceMultiplier
                ).toLocaleString()}{" "}
                USD
              </strong>
            </p>
            <p>
              Baggage: <strong>{baggagePrice.toLocaleString()} USD</strong>
            </p>
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
