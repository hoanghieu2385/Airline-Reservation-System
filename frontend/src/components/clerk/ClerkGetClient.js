import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/Admin/UserManagement.css";
import { getUsers, updateUser } from "../../services/adminApi";

const ClerkGetClient = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await getUsers({ role: "USER" });
      setData(response.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setData([]);
    }
  };

  const validatePhoneNumber = (phoneNumber) => /^[0-9]{10,15}$/.test(phoneNumber);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Check phone number validity
    if (form.phoneNumber && !validatePhoneNumber(form.phoneNumber)) {
      alert("Invalid phone number format. Please enter 10-15 digits.");
      return;
    }

    try {
      if (editingRecord) {
        await updateUser(editingRecord.id, {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
        });
        alert("User updated successfully");
        setEditingRecord(null);
        fetchClients();
      }
    } catch (error) {
      alert("Failed to update user");
    }
  };

  const filteredData = data.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  return (
    <div className="user-management__container mt-4">
      <h2>Clerk - Client Management</h2>

      {/* Search form */}
      <div className="user-management__search mb-3">
        <input
          type="text"
          placeholder="Search by name, email..."
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Table user */}
      <table className="table table-striped user-management__table">
        <thead>
          <tr>
            <th>#</th>
            <th
              onClick={() => handleSort("firstName")}
              className="user-management__sortable-column"
            >
              First Name{" "}
              {sortConfig.key === "firstName" &&
                (sortConfig.direction === "asc" ? (
                  <FontAwesomeIcon icon={faSortDown} />
                ) : (
                  <FontAwesomeIcon icon={faSortUp} />
                ))}
            </th>
            <th
              onClick={() => handleSort("lastName")}
              className="user-management__sortable-column"
            >
              Last Name{" "}
              {sortConfig.key === "lastName" &&
                (sortConfig.direction === "asc" ? (
                  <FontAwesomeIcon icon={faSortDown} />
                ) : (
                  <FontAwesomeIcon icon={faSortUp} />
                ))}
            </th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm user-management__edit-button"
                  onClick={() => {
                    setForm(user);
                    setEditingRecord(user);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="user-management__pagination d-flex justify-content-between align-items-center">
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

      {/* Modal edit user */}
      {editingRecord && (
        <div
          className="modal show d-block user-management__modal"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingRecord(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  {/* First Name */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      required
                    />
                    <label>First Name</label>
                  </div>

                  {/* Last Name */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      required
                    />
                    <label>Last Name</label>
                  </div>

                  {/* Phone Number */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone Number"
                      value={form.phoneNumber}
                      onChange={(e) =>
                        setForm({ ...form, phoneNumber: e.target.value })
                      }
                    />
                    <label>Phone Number</label>
                  </div>

                  {/* Buttons */}
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setEditingRecord(null)}
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

export default ClerkGetClient;