import React, { useEffect, useState } from "react";
import "../../assets/css/AirportsManagement.css";
import { getAirports, addAirport, updateAirport, deleteAirport } from "../../services/adminApi";

const AirportsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", city: "", country: "" });

  useEffect(() => {
    fetchAirports();
  });

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const response = await getAirports();
      setData(response.data);
    } catch (error) {
      alert("Failed to fetch airports");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      if (editingRecord) {
        await updateAirport(editingRecord.id, form);
        alert("Airport updated successfully");
      } else {
        await addAirport(form);
        alert("Airport added successfully");
      }
      setModalVisible(false);
      fetchAirports();
    } catch (error) {
      alert("Failed to save airport");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    setLoading(true);
    try {
      await deleteAirport(record.id);
      alert("Airport deleted successfully");
      fetchAirports();
    } catch (error) {
      alert("Failed to delete airport");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="airports-management">
      <button className="add-button" onClick={() => {
        setForm({ name: "", code: "", city: "", country: "" });
        setEditingRecord(null);
        setModalVisible(true);
      }}>Add Airport</button>

      <table className="data-table">
        <thead>
          <tr>
            <th>Airport Name</th>
            <th>Code</th>
            <th>City</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.code}</td>
              <td>{record.city}</td>
              <td>{record.country}</td>
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

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingRecord ? "Edit Airport" : "Add Airport"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit();
              }}
            >
              <div className="form-group">
                <label>Airport Name</label>
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
                <label>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">Save</button>
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

export default AirportsManagement;