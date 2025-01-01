import React, { useEffect, useState } from "react";
import {
  getAirlines,
  addAirline,
  updateAirline,
  deleteAirline,
} from "../../services/adminApi";
import { notifySuccess, notifyError } from "../../utils/notification";

const AirlinesManagement = () => {
  const [airlines, setAirlines] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAirline, setEditingAirline] = useState(null);
  const [form, setForm] = useState({
    airlineName: "",
    airlineCode: "",
    country: "",
    contactNumber: "",
    logoUrl: "",
    websiteUrl: "",
  });

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    setLoading(true);
    try {
      const response = await getAirlines();
      const sortedAirlines = (response.data || []).sort((a, b) =>
        a.airlineName.localeCompare(b.airlineName)
      );
      setAirlines(sortedAirlines);
    } catch (error) {
      notifyError("Failed to fetch airlines.");
    } finally {
      setLoading(false);
    }
  };  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.airlineName || !form.airlineCode || !form.contactNumber) {
      notifyError("Airline Name, Code, and Contact Number are required.");
      return;
    }
    setLoading(true);
    try {
      if (editingAirline) {
        await updateAirline(editingAirline.airlineId, form);
        notifySuccess("Airline updated successfully.");
      } else {
        await addAirline(form);
        notifySuccess("Airline added successfully.");
      }
      setIsModalOpen(false);
      fetchAirlines();
    } catch (error) {
      notifyError("Failed to save airline.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (airline) => {
    if (!window.confirm("Are you sure you want to delete this airline?"))
      return;
    setLoading(true);
    try {
      await deleteAirline(airline.airlineId);
      notifySuccess("Airline deleted successfully.");
      fetchAirlines();
    } catch (error) {
      notifyError("Failed to delete airline.");
    } finally {
      setLoading(false);
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
    <div className="management-container mt-4">
      <h2>Airlines Management</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, code, or country..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Add Button */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setIsModalOpen(true)}
      >
        Add Airline
      </button>

      {/* Table */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Code</th>
              <th>Country</th>
              <th>Contact</th>
              <th>Website</th>
              <th>Actions</th>
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
                    {airline.websiteUrl ? (
                      <a href={airline.websiteUrl} target="_blank">
                        Visit
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setForm(airline);
                        setEditingAirline(airline);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(airline)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No airlines available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAirline ? "Edit Airline" : "Add Airline"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  {/* Form Fields */}
                  {["airlineName", "airlineCode", "country", "contactNumber"].map(
                    (field) => (
                      <div className="form-floating mb-3" key={field}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={field}
                          value={form[field]}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              [field]: e.target.value,
                            }))
                          }
                          required={field !== "country"}
                        />
                        <label>{field}</label>
                      </div>
                    )
                  )}
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setIsModalOpen(false)}
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

export default AirlinesManagement;
