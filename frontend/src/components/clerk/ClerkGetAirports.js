import React, { useEffect, useState } from "react";
import { getAirports } from "../../services/adminApi";

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
        response.data.map((record) => ({
          ...record,
          cityName: record.city.cityName,
          country: record.city.country,
        }))
      );
    } catch (error) {
      alert("Failed to fetch airports");
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
    <div className="container mt-4">
      <h2 className="mb-3">Airports Management</h2>

      {/* Search bar */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by ID, name, code, or city..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <span className="input-group-text">Search</span>
      </div>

      {/* Airports table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
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
                <td colSpan="6" className="text-center">
                  No airports available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
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

export default ClerkGetAirports;
