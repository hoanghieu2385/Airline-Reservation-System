import React, { useEffect, useState } from "react";
import { createPayPalOrder } from "../../services/paymentApi";
import "../../assets/css/Payment.css";
import { parse } from "date-fns";

import { parse as dateFnsParse } from "date-fns";


const formatDate = (dateString) => {
  if (!dateString) {
    console.warn("Invalid dateString passed to formatDate:", dateString);
    return "Invalid Date";
  }

  try {
    const parsedDate = parse(dateString, "dd-MM-yyyy, HH:mm", new Date());
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error parsing dateString in formatDate:", error);
    return "Invalid Date";
  }
};

const Payment = () => {
  const [tripDetails, setTripDetails] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // State for payment method

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isCanceled = urlParams.get("cancel");

    // Thêm điều kiện để chỉ chạy alert một lần
    if (isCanceled && !sessionStorage.getItem("alertShown")) {
      alert("Payment was canceled. Please select another payment method or try again.");
      sessionStorage.setItem("alertShown", "true"); // Đặt cờ để không lặp lại alert

      const storedTripDetails = sessionStorage.getItem("tripDetails");
      const storedContactInfo = sessionStorage.getItem("contactInfo");
      const storedTotalPrice = sessionStorage.getItem("totalPrice");

      if (storedTripDetails && storedContactInfo && storedTotalPrice) {
        setTripDetails(JSON.parse(storedTripDetails));
        setContactInfo(JSON.parse(storedContactInfo));
        setTotalPrice(Number(storedTotalPrice));
      } else {
        console.error("No data to restore.");
      }
    }

    // Xóa cờ khi rời khỏi trang để cho phép alert hiển thị lại nếu cần
    return () => {
      sessionStorage.removeItem("alertShown");
    };
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

  const handlePayPalPayment = async () => {
    try {
      const orderData = {
        amount: totalPrice.toFixed(2),
        currency: "USD",
        description: "Flight Reservation",
        returnUrl: "http://localhost:3000/success", // Sử dụng HTTP thay vì HTTPS
        cancelUrl: "http://localhost:3000/payment?cancel=true", // Sử dụng HTTP
      };


      // Lưu trạng thái hiện tại vào sessionStorage
      sessionStorage.setItem(
        "tripDetails",
        JSON.stringify({
          ...tripDetails,
          departureTime: tripDetails.FormattedDeparture,
        })
      );
      sessionStorage.setItem("contactInfo", JSON.stringify(contactInfo));
      sessionStorage.setItem("totalPrice", totalPrice);

      const response = await createPayPalOrder(orderData);
      if (response.approveUrl) {
        window.location.href = response.approveUrl;
      } else {
        alert("Could not retrieve PayPal checkout URL.");
      }
    } catch (error) {
      console.error("Error during PayPal payment:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };


  const handleReservation = async (status) => {
    try {
      if (status === "Confirmed" && selectedPaymentMethod === "paypal") {
        await handlePayPalPayment();
        return;
      }

      // Các logic khác cho các phương thức thanh toán khác
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
          <p>
            <strong>Departure Time:</strong> {formatDate(tripDetails?.departureTime)}
          </p>

        </p>
        <p>
          <strong>Total Price:</strong> {totalPrice.toLocaleString()} USD
        </p>
        <h3>Contact Information</h3>
        <p>
          <strong>Name:</strong> {contactInfo.firstName} {contactInfo.lastName}
        </p>
        <p>
          <strong>Email:</strong> {contactInfo.email}
        </p>
        <p>
          <strong>Phone:</strong> {contactInfo.phone}
        </p>
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
