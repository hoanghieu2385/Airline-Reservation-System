import React, { useEffect, useState } from "react";
import "../../assets/css/Admin/AirlinesManagement.css";
import {
  getAirlines,
  addAirline,
  updateAirline,
  deleteAirline,
} from "../../services/adminApi";

const AirlinesManagement = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAirline, setEditingAirline] = useState(null);
  const [form, setForm] = useState(initialFormState());

  useEffect(() => {
    fetchAirlines();
  }, []);

  function initialFormState() {
    return {
      airlineName: "",
      airlineCode: "",
      country: "",
      contactNumber: "",
      logoUrl: "",
      websiteUrl: "",
      seatClasses: [{ className: "", luggageAllowance: 0, baseMultiplier: 0 }],
    };
  }

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

  const handleFormSubmit = async () => {
    if (!form.airlineName || !form.airlineCode || !form.contactNumber) {
      alert("Airline Name, Code, and Contact Number are required.");
      return;
    }

    setLoading(true);
    try {
      if (editingAirline) {
        await updateAirline(editingAirline.airlineId, form);
        alert("Airline updated successfully.");
      } else {
        await addAirline(form);
        alert("Airline added successfully.");
      }
      closeModal();
      fetchAirlines();
    } catch (error) {
      console.error("Error saving airline:", error.response?.data || error.message);
      alert("Failed to save airline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (airline) => {
    if (!window.confirm("Are you sure you want to delete this airline?")) return;

    setLoading(true);
    try {
      await deleteAirline(airline.airlineId);
      alert("Airline deleted successfully.");
      fetchAirlines();
    } catch (error) {
      console.error("Error deleting airline:", error.response?.data || error.message);
      alert("Failed to delete airline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setForm(initialFormState());
    setEditingAirline(null);
    setIsModalOpen(false);
  };

  const handleSeatClassChange = (index, field, value) => {
    const updatedSeatClasses = [...form.seatClasses];
    updatedSeatClasses[index][field] = value;
    setForm((prev) => ({ ...prev, seatClasses: updatedSeatClasses }));
  };

  return (
    <div className="airlines-management">
      <button
        className="add-button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Add Airline"
      >
        Add Airline
      </button>
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
              <th>Actions</th>
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
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => {
                        setForm(airline);
                        setEditingAirline(airline);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(airline)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No airlines available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingAirline ? "Edit Airline" : "Add Airline"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit();
              }}
            >
              <div className="form-group">
                <label>Airline Name</label>
                <input
                  type="text"
                  value={form.airlineName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, airlineName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Code</label>
                <input
                  type="text"
                  value={form.airlineCode}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, airlineCode: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, contactNumber: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Seat Classes</label>
                {form.seatClasses.map((seat, index) => (
                  <div key={index} className="seat-class-group">
                    <select
                      value={seat.className}
                      onChange={(e) =>
                        handleSeatClassChange(index, "className", e.target.value)
                      }
                    >
                      <option value="">Select Class</option>
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="FirstClass">First Class</option>                      
                    </select>
                    <br></br>
                    <br></br>
                    <input
                      type="number"
                      placeholder="Luggage Allowance"
                      value={seat.luggageAllowance}                      
                      onChange={(e) =>
                        handleSeatClassChange(
                          index,
                          "luggageAllowance",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <br></br>
                    <br></br>                    
                    <input
                      type="number"
                      placeholder="Base Multiplier"
                      value={seat.baseMultiplier}
                      onChange={(e) =>
                        handleSeatClassChange(
                          index,
                          "baseMultiplier",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                ))}
                <br></br>
                    <br></br>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      seatClasses: [
                        ...prev.seatClasses,
                        { className: "", luggageAllowance: 0, baseMultiplier: 0 },
                      ],
                    }))
                  }
                >
                  Add Seat Class
                </button>
              </div>
              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="text"
                  value={form.logoUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, logoUrl: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Website URL</label>
                <input
                  type="text"
                  value={form.websiteUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, websiteUrl: e.target.value }))
                  }
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirlinesManagement;
