import React, { useState, useEffect } from "react";
import flightService from "D:\Coding\eProject3\Airline-Reservation-System\frontend\src\components\api\FlightService.js";
import FlightCard from "./FlightCard";

const FlightList = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      const data = await flightService.getAllFlights();
      setFlights(data);
    };
    fetchFlights();
  }, []);

  return (
    <div>
      <h2>Danh sách chuyến bay</h2>
      {flights.map((flight) => (
        <FlightCard key={flight.flightId} flight={flight} />
      ))}
    </div>
  );
};

export default FlightList;
