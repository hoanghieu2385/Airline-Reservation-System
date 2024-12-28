import React, { useEffect, useState } from "react";
import "../../assets/css/Admin/AirlinesManagement.css";
import { getAirlines } from "../../services/clerkApi";

const ClerkGetAirlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    setLoading(true);
    try {
      const response = await getAirlines();
      setAirlines(response.data || []);
    } catch (error) {
      console.error("Error fetching airlines:", error.message);
      alert("Failed to fetch airlines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="airlines-management">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Country</th>
              <th>Logo</th>
              <th>Contact</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {airlines.length > 0 ? (
              airlines.map((airline) => (
                <tr key={airline.airlineId}>
                  <td>{airline.airlineName}</td>
                  <td>{airline.airlineCode}</td>
                  <td>{airline.country}</td>
                  <td>{airline.logoUrl}</td>
                  <td>{airline.contactNumber}</td>
                  <td>{airline.websiteUrl}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No airlines available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClerkGetAirlines;
