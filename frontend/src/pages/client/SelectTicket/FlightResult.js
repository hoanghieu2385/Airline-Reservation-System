import React from "react";
import FlightCard from "./FlightCard";

const FlightResults = ({ flights }) => {
  return (
    <section className="flight-results">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </section>
  );
};

export default FlightResults;
