import React, { useEffect, useState } from "react";
import { getCities, addCity, updateCity, deleteCity } from "../../services/adminApi";

const CitiesManagement = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({
    cityName: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await getCities();
      setData(response.data || []);
    } catch (error) {
      alert("Failed to fetch cities");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingRecord) {
        await updateCity(editingRecord.cityId, form);
        alert("City updated successfully");
      } else {
        await addCity(form);
        alert("City added successfully");
      }
      setModalVisible(false);
      fetchCities();
    } catch (error) {
      alert("Failed to save city");
    }
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Are you sure you want to delete the city ${record.cityName}?`)) return;

    try {
      await deleteCity(record.cityId);
      alert("City deleted successfully");
      fetchCities();
    } catch (error) {
      alert("Failed to delete city");
    }
  };

  const filteredData = data.filter(
    (city) =>
      city.cityName.toLowerCase().includes(searchText.toLowerCase()) ||
      city.state.toLowerCase().includes(searchText.toLowerCase()) ||
      city.country.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCities = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="cities-mgmt-container mt-4">
    <h2>Cities Management</h2>
  
    {/* Search bar */}
    <div className="cities-mgmt-search mb-3">
      <input
        type="text"
        placeholder="Search by name, state, country..."
        className="form-control"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  
    {/* Add city button */}
    <button
      className="btn btn-primary cities-mgmt-add-button mb-3"
      onClick={() => {
        setForm({ cityName: "", state: "", country: "" });
        setEditingRecord(null);
        setModalVisible(true);
      }}
    >
      Add City
    </button>
  
    {/* Cities table */}
    <table className="table table-striped cities-mgmt-table">
      <thead>
        <tr>
          <th>#</th>
          <th>City Name</th>
          <th>State</th>
          <th>Country</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentCities.length > 0 ? (
          currentCities.map((city, index) => (
            <tr key={city.cityId}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{city.cityName}</td>
              <td>{city.state}</td>
              <td>{city.country}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setForm(city);
                    setEditingRecord(city);
                    setModalVisible(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(city)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No cities available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  
    {/* Pagination */}
    <div className="cities-mgmt-pagination d-flex justify-content-between align-items-center">
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
      <div className="modal show d-block cities-mgmt-modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingRecord ? "Edit City" : "Add City"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalVisible(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleFormSubmit}>
                {/* City Name */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingCityName"
                    placeholder="City Name"
                    value={form.cityName}
                    onChange={(e) => setForm({ ...form, cityName: e.target.value })}
                    required
                  />
                  <label htmlFor="floatingCityName">City Name</label>
                </div>
  
                {/* State */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingState"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
                  <label htmlFor="floatingState">State</label>
                </div>
  
                {/* Country */}
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingCountry"
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    required
                  />
                  <label htmlFor="floatingCountry">Country</label>
                </div>
  
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

export default CitiesManagement;
