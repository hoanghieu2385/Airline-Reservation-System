import React, { useEffect, useState } from "react";
import "../../assets/css/AirlinesManagement.css";
import {
  getAirlines,
  addAirline,
  updateAirline,
  deleteAirline,
} from "../../services/adminApi";

const AirlinesManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    country: "",
    contactNumber: "",
  });

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    setLoading(true);
    try {
      const response = await getAirlines();
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching airlines:", error.message);
      alert("Error fetching airlines. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {    
    if (!form.name || !form.code || !form.contactNumber) {
      alert("Please fill in all required fields: Name, Code, and Contact Number.");
      return;
    }

    setLoading(true);
    try {
      if (editingRecord) {
        await updateAirline(editingRecord.id, form);
        alert("Airline updated successfully.");
      } else {
        await addAirline(form);
        alert("Airline added successfully.");
      }
      setModalVisible(false);
      fetchAirlines();
    } catch (error) {
      console.error("Error saving airline:", error.message);
      alert("Error saving airline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    if (!window.confirm("Are you sure you want to delete this airline?")) return;

    setLoading(true);
    try {
      await deleteAirline(record.id);
      alert("Airline deleted successfully.");
      fetchAirlines();
    } catch (error) {
      console.error("Error deleting airline:", error.message);
      alert("Error deleting airline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="airlines-management">
      <button
        className="add-button"
        onClick={() => {
          setForm({ name: "", code: "", country: "", contactNumber: "" });
          setEditingRecord(null);
          setModalVisible(true);
        }}
      >
        Add Airline
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Airline Id</th>
              <th>Airline Name</th>
              <th>Code</th>
              <th>Country</th>
              <th>Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => (
              <tr key={record.id}>
                <td>{record.airlineId}</td>
                <td>{record.airlineName}</td>
                <td>{record.airlineCode}</td>
                <td>{record.country}</td>
                <td>{record.contactNumber}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setForm(record);
                      setEditingRecord(record);
                      setModalVisible(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(record)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingRecord ? "Edit Airline" : "Add Airline"}</h3>
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
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm({ ...form, contactNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setModalVisible(false)}
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
