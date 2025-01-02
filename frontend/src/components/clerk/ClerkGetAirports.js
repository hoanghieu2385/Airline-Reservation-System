import React, { useEffect, useState } from "react";
import { getAirports } from "../../services/adminApi";
import { notifyError } from "../../utils/notification";

const ClerkGetAirports = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await getAirports();
      setData(
        response.data
          .map((record) => ({
            ...record,
            cityName: record.city.cityName,
            country: record.city.country,
          }))
          .sort((a, b) => a.airportName.localeCompare(b.airportName))
      );
    } catch (error) {
      notifyError("Failed to fetch airports");
    }
  };

  const filteredData = data.filter(
    (airport) =>
      airport.airportName.toLowerCase().includes(searchText.toLowerCase()) ||
      airport.cityName.toLowerCase().includes(searchText.toLowerCase()) ||
      airport.airportCode.toLowerCase().includes(searchText.toLowerCase()) ||
      airport.airportId.toString().includes(searchText)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAirports = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="clerk-dashboard-container mt-4">
      <h2 className="clerk-dashboard-title mb-3">Airports Management</h2>

      {/* Search bar */}
      <div className="clerk-dashboard-search input-group mb-3">
        <input
          type="text"
          className="clerk-dashboard-search-input form-control"
          placeholder="Search by ID, name, code, or city..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <span className="clerk-dashboard-search-btn input-group-text">Search</span>
      </div>

      {/* Airports table */}
      <div className="clerk-dashboard-table table-responsive">
        <table className="clerk-dashboard-table-main table table-bordered table-hover">
          <thead className="clerk-dashboard-table-header table-light">
            <tr>
              <th>#</th>
              <th>Airport Name</th>
              <th>Code</th>
              <th>City</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {currentAirports.length > 0 ? (
              currentAirports.map((airport, index) => (
                <tr key={airport.airportId}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{airport.airportName}</td>
                  <td>{airport.airportCode}</td>
                  <td>{airport.cityName}</td>
                  <td>{airport.country}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No airports available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="clerk-dashboard-pagination d-flex justify-content-between align-items-center mt-3">
        <button
          className="clerk-dashboard-pagination-prev btn btn-outline-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="clerk-dashboard-pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="clerk-dashboard-pagination-next btn btn-outline-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClerkGetAirports;