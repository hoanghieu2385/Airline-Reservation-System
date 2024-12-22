import React, { useEffect, useState } from "react";
import "../../assets/css/Payment.css";

const Payment = () => {
  const [tripDetails, setTripDetails] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("checkoutData");
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

  // Hàm xử lý khi nhấn nút Proceed
  const handleProceed = async () => {
    try {
      const reservationData = {
        flightDetails: tripDetails,
        contactInfo: contactInfo,
        totalPrice: totalPrice,
      };

      const passengerData = {
        passengers: JSON.parse(localStorage.getItem("passengers")) || [],
      };

      // Gửi dữ liệu Reservation
      const reservationResponse = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!reservationResponse.ok) {
        throw new Error("Failed to create reservation. Please try again.");
      }

      const reservationResult = await reservationResponse.json();

      // Gắn reservationId vào dữ liệu hành khách
      const passengersWithReservation = passengerData.passengers.map((passenger) => ({
        ...passenger,
        reservationId: reservationResult.id,
      }));

      // Gửi dữ liệu Passenger
      const passengerResponse = await fetch("/api/passenger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passengersWithReservation),
      });

      if (!passengerResponse.ok) {
        throw new Error("Failed to create passengers. Please try again.");
      }

      alert("Proceed successfully completed!");
    } catch (error) {
      console.error("Error during proceed:", error);
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
              <input type="radio" id={method.id} name="payment" value={method.id} />
              <label htmlFor={method.id}>{method.label}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="payment-summary">
        <h3>Trip Details</h3>
        <p><strong>Airline:</strong> {tripDetails?.departure?.airlineName}</p>
        <p><strong>Flight Number:</strong> {tripDetails?.departure?.flightNumber}</p>
        <p><strong>Departure Time:</strong> {tripDetails?.departure?.departureTime}</p>
        <p><strong>Total Price:</strong> {totalPrice.toLocaleString()} USD</p>
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> {contactInfo.firstName} {contactInfo.lastName}</p>
        <p><strong>Age:</strong> {contactInfo.age}</p>
        <p><strong>Email:</strong> {contactInfo.email}</p>
        <p><strong>Phone:</strong> {contactInfo.phone}</p>
        <p><strong>Address:</strong> {contactInfo.address}</p>
      </div>
      <div className="payment-proceed">
        <button onClick={handleProceed} className="proceed-button">
          Proceed
        </button>
      </div>
    </div>
  );
};

export default Payment;
