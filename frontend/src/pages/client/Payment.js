import React, { useEffect, useState } from "react";
import { createPayPalOrder } from "../../services/paymentApi";
import "../../assets/css/Payment.css";

const Payment = () => {
  const [tripDetails, setTripDetails] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [passengers, setPassengers] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessingReservation, setIsProcessingReservation] = useState(false);

  // Debugging useEffect
  useEffect(() => {
    console.log("Trip Details State Updated:", tripDetails);
    console.log("Contact Info State Updated:", contactInfo);
    console.log("Total Price State Updated:", totalPrice);
  }, [tripDetails, contactInfo, totalPrice]);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isCanceled = urlParams.get("cancel");
      const isSuccess = urlParams.get("success");
      const savedCheckoutData = sessionStorage.getItem("checkoutData");

      if (savedCheckoutData) {
        const parsedData = JSON.parse(savedCheckoutData);
        console.log("Loaded Checkout Data:", parsedData);

        setTripDetails(parsedData.tripDetails || {});
        setContactInfo(parsedData.contactInfo || {});
        setPassengers(parsedData.passengers || []);
        setTotalPrice(parsedData.totalPrice || 0);

        // Format departure time
        if (parsedData.tripDetails?.departureTime) {
          const formattedDate = new Date(
            parsedData.tripDetails.departureTime
          ).toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
          setTripDetails((prev) => ({
            ...prev,
            formattedDeparture: formattedDate,
          }));
        }

        if (isSuccess) {
          handleFinalizeReservation("Confirmed", parsedData);
          return;
        }
      } else {
        console.warn("No checkout data found in sessionStorage.");
      }

      if (isCanceled && !sessionStorage.getItem("alertShown")) {
        alert(
          "Payment was canceled. Please select another payment method or try again."
        );
        sessionStorage.setItem("alertShown", "true");
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
    { id: "credit_card", label: "Credit Card" },
    { id: "bank_transfer", label: "Bank Transfer" },
    { id: "apple_pay", label: "Apple Pay" },
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
      console.log("Reservation Data:", reservationData);

      const passengers = sessionStorage.getItem("passengers")
        ? JSON.parse(sessionStorage.getItem("passengers"))
        : [];

      const userId = reservationData.userId || sessionStorage.getItem("userId");
      const reservationId = reservationData.reservationId;

      if (!userId) {
        throw new Error("User is not logged in or UserId is missing.");
      }

      if (reservationId) {
        // Update existing reservation
        const updateData = { ReservationStatus: status };

        const response = await fetch(
          `https://localhost:7238/api/Reservations/${reservationId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify(updateData),
          }
        );

        if (!response.ok) throw new Error(await response.text());

        alert(`Reservation ${status.toLowerCase()} successfully updated!`);
        window.location.href = "/user/dashboard";
      } else {
        // Create new reservation
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

        console.log("Final Reservation Data:", finalReservationData);

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

        alert(`Reservation ${status.toLowerCase()} successfully created!`);
      }

      // Delete data from storage after finishing
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

      console.log("Reservation Data before finalization:", reservationData);

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
      <h2 className="payment-page-title">Finalize Your Reservation</h2>

      <div className="payment-content">
        {/* Left Container: Trip Details & Passenger Information */}
        <div className="payment-left-container">
          <div className="details-container">
            <h3>Trip Details</h3>
            <p>
              <strong>Airline:</strong> {tripDetails.airlineName || "N/A"}
            </p>
            <p>
              <strong>Flight Number:</strong>{" "}
              {tripDetails.flightNumber || "N/A"}
            </p>
            <p>
              <strong>Departure Time:</strong>{" "}
              {tripDetails.formattedDeparture || "N/A"}
            </p>
            <p>
              <strong>Total Price:</strong> {totalPrice.toLocaleString()} USD
            </p>
          </div>

          <div className="payment-passenger-info">
            <h3>Passenger Information</h3>
            {passengers.length > 0 ? (
              passengers.map((passenger, index) => (
                <div key={index} className="passenger-info">
                  <p>
                    <strong>Title:</strong> {passenger.gender || "N/A"}
                  </p>
                  <p>
                    <strong>Name:</strong> {passenger.firstName}{" "}
                    {passenger.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {passenger.email}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {passenger.phoneNumber}
                  </p>
                </div>
              ))
            ) : (
              <p>No passenger information available.</p>
            )}
          </div>
        </div>

        {/* Right Container: Contact Information & Payment Methods */}
        <div className="payment-right-container">
          <div className="details-container">
            <h3>Contact Information</h3>
            <p>
              <strong>Name:</strong> {contactInfo.firstName || "N/A"}{" "}
              {contactInfo.lastName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {contactInfo.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {contactInfo.phoneNumber || "N/A"}
            </p>
          </div>

          <div className="payment-methods">
            <h3>Select Your Payment Method</h3>
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
        </div>
      </div>

      {/* Reservation Actions */}
      <div className="payment-actions">
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
