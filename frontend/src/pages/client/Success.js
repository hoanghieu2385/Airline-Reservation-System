import React, { useEffect, useState } from "react";

const Success = () => {
  const [isFinalized, setIsFinalized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Prevent multiple API calls

  useEffect(() => {
    const finalizePayPalReservation = async () => {
      if (sessionStorage.getItem("reservationFinalized")) {
        console.log("Reservation already finalized. Skipping duplicate call.");
        return;
      }

      setIsProcessing(true); // Mark as processing

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const payerId = urlParams.get("PayerID");

        if (!token || !payerId) {
          throw new Error(
            "Missing PayPal token or payer ID. Cannot finalize reservation."
          );
        }

        const reservationData = JSON.parse(
          sessionStorage.getItem("reservationData")
        );
        if (!reservationData) {
          throw new Error(
            "No reservation data found. Cannot complete the reservation."
          );
        }

        const response = await fetch(
          "https://localhost:7238/api/Reservations/FinalizeReservation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              ReservationStatus: "Confirmed",
              UserId: reservationData.userId,
              FlightId: reservationData.tripDetails.flightId,
              AllocationId: reservationData.tripDetails.allocationId,
              Passengers: JSON.parse(reservationData.passengers).map(
                (passenger) => ({
                  FirstName: passenger.firstName,
                  LastName: passenger.lastName,
                  Gender: passenger.gender,
                  Email: passenger.email,
                  PhoneNumber: passenger.phoneNumber,
                })
              ),
              PayPalToken: token,
              PayPalPayerId: payerId,
            }),
          }
        );

        if (!response.ok) throw new Error(await response.text());

        alert("Reservation confirmed successfully!");
        sessionStorage.setItem("reservationFinalized", "true");
        sessionStorage.removeItem("reservationData");
        setIsFinalized(true);
      } catch (error) {
        console.error("Error finalizing reservation:", error);
        alert("An error occurred while finalizing your reservation.");
      } finally {
        setIsProcessing(false); // Reset processing flag
      }
    };

    finalizePayPalReservation();
  }, []);

  return (
    <div className="success-page">
      <h1>Payment Successful!</h1>
      <p>
        {isFinalized
          ? "Your reservation has been successfully finalized."
          : "Your reservation is being finalized. Please wait..."}
      </p>
    </div>
  );
};

export default Success;
