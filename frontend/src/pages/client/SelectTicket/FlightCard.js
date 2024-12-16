import React from "react";

const FlightCard = ({ flight }) => {
  return (
    <div className="flight-card">
      <div className="airline">{flight.airlineName}</div>
      <div className="duration">{flight.duration}</div>
      <div className="stops">{flight.stops} Stop(s)</div>
      <div className="price">${flight.price}</div>
    </div>
  );
};

export default FlightCard;
