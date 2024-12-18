import React, { useEffect, useState } from "react";
import "../../assets/css/CitiesManagement.css";
import { getCities, addCity, updateCity, deleteCity } from "../../services/adminApi";

const CitiesManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({ name: "", state: "", country: "" });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await getCities();
      setData(response.data);
    } catch (error) {
      alert("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      if (editingRecord) {
        await updateCity(editingRecord.id, form);
        alert("City updated successfully");
      } else {
        await addCity(form);
        alert("City added successfully");
      }
      setModalVisible(false);
      fetchCities();
    } catch (error) {
      alert("Failed to save city");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    setLoading(true);
    try {
      await deleteCity(record.id);
      alert("City deleted successfully");
      fetchCities();
    } catch (error) {
      alert("Failed to delete city");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cities-management">
      <button className="add-button" onClick={() => {
        setForm({ name: "", state: "", country: "" });
        setEditingRecord(null);
        setModalVisible(true);
      }}>Add City</button>

      <table className="data-table">
        <thead>
          <tr>
            <th>City Name</th>
            <th>State</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.id}>
              <td>{record.name}</td>
              <td>{record.state}</td>
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
            <h3>{editingRecord ? "Edit City" : "Add City"}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFormSubmit();
              }}
            >
              <div className="form-group">
                <label>City Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
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

export default CitiesManagement;