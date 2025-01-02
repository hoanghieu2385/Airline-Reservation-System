import React, { useEffect, useState } from "react";
import { getAirlines } from "../../services/clerkApi";
import { notifyError } from "../../utils/notification";

const ClerkGetAirlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const response = await getAirlines();
      setAirlines(
        (response.data || []).sort((a, b) =>
          a.airlineName.localeCompare(b.airlineName)
        )
      );
    } catch (error) {
      notifyError("Failed to fetch airlines. Please try again.");
    }
  };

  const filteredAirlines = airlines.filter(
    (airline) =>
      airline.airlineName.toLowerCase().includes(searchText.toLowerCase()) ||
      airline.airlineCode.toLowerCase().includes(searchText.toLowerCase()) ||
      airline.country.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAirlines = filteredAirlines.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAirlines.length / itemsPerPage);

  return (
    <div className="clerk-dashboard-airlines-container mt-4">
      <h2 className="clerk-dashboard-airlines-title mb-3">Airlines Management</h2>

      {/* Search bar */}
      <div className="clerk-dashboard-airlines-search input-group mb-3">
        <input
          type="text"
          className="clerk-dashboard-airlines-search-input form-control"
          placeholder="Search by name, code, or country..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <span className="clerk-dashboard-airlines-search-btn input-group-text">
          Search
        </span>
      </div>

      {/* Airlines table */}
      <div className="clerk-dashboard-airlines-table table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Airline Name</th>
              <th>Code</th>
              <th>Country</th>
              <th>Contact</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {currentAirlines.length > 0 ? (
              currentAirlines.map((airline, index) => (
                <tr key={airline.airlineId}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{airline.airlineName}</td>
                  <td>{airline.airlineCode}</td>
                  <td>{airline.country}</td>
                  <td>{airline.contactNumber}</td>
                  <td>
                    <a
                      href={airline.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No airlines available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="clerk-dashboard-airlines-pagination d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClerkGetAirlines;