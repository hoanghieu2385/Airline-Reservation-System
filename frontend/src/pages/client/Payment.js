import React, { useEffect, useState } from "react";
import "../../assets/css/Payment.css";

// Mock payment processing function
const mockProcessPayment = async (method, amount) => {
  console.log(`Processing payment of ${amount} USD via ${method}...`);

  // Simulate a delay for payment processing
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate success (80%) or failure (20%)
  const isSuccess = Math.random() > 0.2;
  if (isSuccess) {
    console.log("Payment successful!");
    return { success: true, transactionId: "MOCK123456" };
  } else {
    console.log("Payment failed!");
    return { success: false, error: "Transaction declined" };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const Payment = () => {
  const [tripDetails, setTripDetails] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // Added state for payment method

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("checkoutData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setTripDetails(parsedData.flightDetails);
        setContactInfo(parsedData.contactInfo);
        setTotalPrice(parsedData.totalPrice);
      }
    } catch (error) {
      console.error("Error parsing checkout data:", error);
    }
  }, []);

  const paymentMethods = [
    { id: "wechat", label: "WeChat Pay" },
    { id: "credit", label: "International credit or debit card" },
    { id: "clicktopay", label: "Click to Pay" },
    { id: "paypal", label: "PayPal" },
    { id: "googlepay", label: "Google Pay" },
    { id: "unionpay", label: "UnionPay" },
    { id: "alipay", label: "Alipay" },
  ];

  // Function to handle reservation actions
  const handleReservation = async (status) => {
    try {
      if (status === "Confirmed") {
        if (!selectedPaymentMethod) {
          alert("Please select a payment method.");
          return;
        }

        const paymentResult = await mockProcessPayment(
          selectedPaymentMethod,
          totalPrice
        );
        if (!paymentResult.success) {
          alert(`Payment failed: ${paymentResult.error}`);
          return;
        }
        alert(
          `Payment successful! Transaction ID: ${paymentResult.transactionId}`
        );
      }

      const passengers = JSON.parse(sessionStorage.getItem("passengers")) || [];
      const userId = sessionStorage.getItem("userId");

      if (!userId)
        throw new Error("User is not logged in or UserId is missing.");

      const reservationData = {
        ReservationStatus: status,
        UserId: userId,
        FlightId: tripDetails.flightId,
        AllocationId: tripDetails.allocationId,
        Passengers: passengers.map((passenger) => ({
          FirstName: passenger.firstName,
          LastName: passenger.lastName,
          Gender: passenger.gender,
          Email: passenger.email,
          PhoneNumber: passenger.phoneNumber,
        })),
      };

      const response = await fetch(
        "https://localhost:7238/api/Reservations/FinalizeReservation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      alert(`Reservation ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(`Error during ${status.toLowerCase()} reservation:`, error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="payment-page-container">
      <div className="payment-methods">
        <h3>Select your preferred payment method</h3>
        <div className="payment-methods-list">
          {paymentMethods.map((method) => (
            <div key={method.id} className="payment-method-box">
              <input
                type="radio"
                id={method.id}
                name="payment"
                value={method.id}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              />
              <label htmlFor={method.id}>{method.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="payment-summary">
        <h3>Trip Details</h3>
        <p>
          <strong>Airline:</strong> {tripDetails?.airlineName}
        </p>
        <p>
          <strong>Flight Number:</strong> {tripDetails?.flightNumber}
        </p>
        <p>
          <strong>Departure Time:</strong>{" "}
          {formatDate(tripDetails?.departureTime)}
        </p>
        <p>
          <strong>Total Price:</strong> {totalPrice.toLocaleString()} USD
        </p>
        <h3>Contact Information</h3>
        <p>
          <strong>Name:</strong> {contactInfo.firstName} {contactInfo.lastName}
        </p>
        {/* <p><strong>Age:</strong> {contactInfo.age}</p> */}
        <p>
          <strong>Email:</strong> {contactInfo.email}
        </p>
        <p>
          <strong>Phone:</strong> {contactInfo.phone}
        </p>
        {/* <p><strong>Address:</strong> {contactInfo.address}</p> */}
      </div>
      <div className="payment-proceed">
        <button
          onClick={() => handleReservation("Confirmed")}
          className="confirm-button"
        >
          Confirm Reservation
        </button>
        <button
          onClick={() => handleReservation("Blocked")}
          className="block-button"
        >
          Block Reservation
        </button>
      </div>
    </div>
  );
};

export default Payment;
