import React, { useEffect, useState } from "react";
import { getAirports, addAirport, updateAirport, deleteAirport } from "../../services/adminApi";

const AirportsManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({ airportName: "", airportCode: "", cityId: "", country: "" });

  useEffect(() => {
    fetchAirports();
  }, []);
  const fetchAirports = async () => {
    setLoading(true);
    try {
      const response = await getAirports();
      setData(response.data || []);
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
        await updateAirport(editingRecord.airportId, form);
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
      await deleteAirport(record.airportId);
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
        setForm({ airportName: "", airportCode: "", cityId: "", country: "" });
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
          {data.length > 0 ? (
            data.map((record) => (
              <tr key={record.airportId}>
                <td>{record.airportName}</td>
                <td>{record.airportCode}</td>
                <td>{record.city.cityName}</td>
                <td>{record.city.country}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => {
                      setForm({
                        airportName: record.airportName,
                        airportCode: record.airportCode,
                        cityId: record.city.cityId,
                        country: record.city.country,
                      });
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
            ))
          ) : (
            <tr>
              <td colSpan="5">No airports available</td>
            </tr>
          )}
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
                  value={form.airportName}
                  onChange={(e) => setForm({ ...form, airportName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Code</label>
                <input
                  type="text"
                  value={form.airportCode}
                  onChange={(e) => setForm({ ...form, airportCode: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={form.cityId}
                  onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                  required
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
