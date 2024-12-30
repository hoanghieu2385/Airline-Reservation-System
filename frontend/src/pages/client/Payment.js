import React, { useEffect, useState } from "react";
import { createPayPalOrder } from "../../services/paymentApi";
import "../../assets/css/Payment.css";

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessingReservation, setIsProcessingReservation] = useState(false);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isCanceled = urlParams.get("cancel");
      const isSuccess = urlParams.get("success");
      const savedReservationData = sessionStorage.getItem("reservationData");
  
      // Check if reservation has already been processed
      const reservationProcessed = sessionStorage.getItem("reservationProcessed");
  
      if (isSuccess && savedReservationData && !reservationProcessed) {
        const parsedData = JSON.parse(savedReservationData);
  
        // Mark reservation as processed
        sessionStorage.setItem("reservationProcessed", "true");
  
        handleFinalizeReservation("Confirmed", parsedData);
        return;
      }
  
      if (isCanceled && !sessionStorage.getItem("alertShown")) {
        alert("Payment was canceled. Please select another payment method or try again.");
        sessionStorage.setItem("alertShown", "true");
  
        if (savedReservationData) {
          const parsedData = JSON.parse(savedReservationData);
          setTripDetails(parsedData.tripDetails);
          setContactInfo(parsedData.contactInfo);
          setTotalPrice(parsedData.totalPrice);
        }
      } else {
        const storedData = sessionStorage.getItem("checkoutData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setTripDetails(parsedData.flightDetails);
          setContactInfo(parsedData.contactInfo);
          setTotalPrice(parsedData.totalPrice);
        }
      }
    } catch (error) {
      console.error("Error processing payment data:", error);
    }
  
    return () => {
      sessionStorage.removeItem("alertShown");
    };
  }, []);
  

  const paymentMethods = [
    { id: "paypal", label: "PayPal" },
    { id: "googlepay", label: "Google Pay" },
  ];

  const handlePayPalPayment = async () => {
    try {
      const orderData = {
        amount: totalPrice.toFixed(2),
        currency: "USD",
        description: "Flight Reservation",
        returnUrl: "http://localhost:3000/payment?success=true",
        cancelUrl: "http://localhost:3000/payment?cancel=true",
      };

      // Lưu dữ liệu reservation trước khi redirect
      sessionStorage.setItem(
        "reservationData",
        JSON.stringify({
          tripDetails,
          contactInfo,
          passengers: sessionStorage.getItem("passengers"),
          userId: sessionStorage.getItem("userId"),
          totalPrice,
        })
      );

      const response = await createPayPalOrder(orderData);
      if (response.approveUrl) {
        window.location.href = response.approveUrl;
      } else {
        throw new Error("Could not retrieve PayPal checkout URL.");
      }
    } catch (error) {
      console.error("Error during PayPal payment:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleFinalizeReservation = async (status, reservationData) => {
    try {
      const passengers = JSON.parse(reservationData.passengers) || [];
      const userId = reservationData.userId;

      if (!userId) {
        throw new Error("User is not logged in or UserId is missing.");
      }

      const finalReservationData = {
        ReservationStatus: status,
        UserId: userId,
        FlightId: reservationData.tripDetails.flightId,
        AllocationId: reservationData.tripDetails.allocationId,
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
          body: JSON.stringify(finalReservationData),
        }
      );

      if (!response.ok) throw new Error(await response.text());

      alert(`Reservation ${status.toLowerCase()} successfully!`);
      
      // Xóa dữ liệu đã lưu sau khi hoàn tất
      sessionStorage.removeItem("reservationData");
      sessionStorage.removeItem("checkoutData");
      
      // Redirect to success page or dashboard
      window.location.href = "/success";
      
    } catch (error) {
      console.error(`Error during ${status.toLowerCase()} reservation:`, error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handleReservation = async (status) => {
    if (isProcessingReservation) {
      return;
    }
    setIsProcessingReservation(true);

    try {
      if (status === "Confirmed" && selectedPaymentMethod === "paypal") {
        await handlePayPalPayment();
        return;
      }

      // Xử lý các phương thức thanh toán khác
      const reservationData = {
        tripDetails,
        contactInfo,
        passengers: sessionStorage.getItem("passengers"),
        userId: sessionStorage.getItem("userId"),
        totalPrice,
      };

      await handleFinalizeReservation(status, reservationData);
    } catch (error) {
      console.error(`Error during reservation:`, error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsProcessingReservation(false);
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
          <strong>Departure Time:</strong> {tripDetails?.formattedDeparture}
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
          disabled={isProcessingReservation}
        >
          Confirm Reservation
        </button>
        <button
          onClick={() => handleReservation("Blocked")}
          className="block-button"
          disabled={isProcessingReservation}
        >
          Block Reservation
        </button>
      </div>
    </div>
  );
};

export default Payment;