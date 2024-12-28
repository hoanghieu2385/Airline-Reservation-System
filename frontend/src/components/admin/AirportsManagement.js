import React, { useEffect, useState } from "react";
import {
  getAirports,
  addAirport,
  updateAirport,
  deleteAirport,
  getCities,
} from "../../services/adminApi";

const AirportsManagement = () => {
  const [data, setData] = useState([]);
  const [cities, setCities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({
    cityId: "",
    airportCode: "",
    airportName: "",
  });

  useEffect(() => {
    fetchAirports();
    fetchCities();
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

  const fetchCities = async () => {
    try {
      const response = await getCities();
      setCities(response.data || []);
    } catch (error) {
      alert("Failed to fetch cities");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        AirportId: editingRecord?.airportId,
        airportCode: form.airportCode,
        airportName: form.airportName,
        cityId: form.cityId,
      };

      if (editingRecord) {
        await updateAirport(editingRecord.airportId, payload);
        alert("Airport updated successfully!");
      } else {
        await addAirport(payload);
        alert("Airport added successfully!");
      }

      setModalVisible(false);
      fetchAirports();
    } catch (error) {
      console.error("Error during save operation:", error);
      alert("Failed to save the airport. Check the console for details.");
    }
  };

  const handleDelete = async (record) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the airport ${record.airportName}?`
      )
    )
      return;

    try {
      await deleteAirport(record.airportId);
      alert("Airport deleted successfully");
      fetchAirports();
    } catch (error) {
      alert("Failed to delete airport");
    }
  };

  const filteredData = data.filter(
    (airport) =>
      airport.airportName.toLowerCase().includes(searchText.toLowerCase()) ||
      airport.cityName.toLowerCase().includes(searchText.toLowerCase()) ||
      airport.airportCode.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAirports = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="airports-management__container mt-4">
      <h2>Airports Management</h2>

      {/* Search bar */}
      <div className="airports-management__search mb-3">
        <input
          type="text"
          placeholder="Search by name, code, city..."
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Add airport button */}
      <button
        className="btn btn-primary airports-management__add-button mb-3"
        onClick={() => {
          setForm({ cityId: "", airportCode: "", airportName: "" });
          setEditingRecord(null);
          setModalVisible(true);
        }}
      >
        Add Airport
      </button>

      {/* Airports table */}
      <div className="table-responsive">
        <table className="table table-striped airports-management__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Airport Name</th>
              <th>Code</th>
              <th>City</th>
              <th>Country</th>
              <th>Actions</th>
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
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setForm(airport);
                        setEditingRecord(airport);
                        setModalVisible(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(airport)}
                    >
                      Delete
                    </button>
                  </td>
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
      <div className="airports-management__pagination d-flex justify-content-between align-items-center">
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

      {/* Add/Edit modal */}
      {modalVisible && (
        <div
          className="modal show d-block airports-management__modal"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRecord ? "Edit Airport" : "Add Airport"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  {/* City Dropdown */}
                  <div className="form-floating mb-3">
                    <select
                      className="form-control"
                      value={form.cityId}
                      onChange={(e) =>
                        setForm({ ...form, cityId: e.target.value })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select a city
                      </option>
                      {cities.map((city) => (
                        <option key={city.cityId} value={city.cityId}>
                          {city.cityName}
                        </option>
                      ))}
                    </select>
                    <label>City</label>
                  </div>

                  {/* Airport Code */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Airport Code"
                      value={form.airportCode}
                      onChange={(e) =>
                        setForm({ ...form, airportCode: e.target.value })
                      }
                      required
                    />
                    <label>Airport Code</label>
                  </div>

                  {/* Airport Name */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Airport Name"
                      value={form.airportName}
                      onChange={(e) =>
                        setForm({ ...form, airportName: e.target.value })
                      }
                      required
                    />
                    <label>Airport Name</label>
                  </div>

                  {/* Form Actions */}
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setModalVisible(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportsManagement;
