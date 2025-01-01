import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/Admin/UserManagement.css";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../services/adminApi";
import { notifySuccess, notifyError } from "../../utils/notification";


const ClerkManagement = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emailConfirmed: false,
    phoneNumber: "",
    phoneNumberConfirmed: false,
    role: "CLERK",
    password: "",
  });

  useEffect(() => {
    fetchClerks();
  }, []);

  const fetchClerks = async () => {
    try {
      const response = await getUsers({ role: "CLERK" });
      console.log("API Response:", response.data); // Debugging: Ensure API returns correct data
      setData(response.data || []); // Ensure data is set only if it's valid
    } catch (error) {
      console.error("Failed to fetch clerks:", error);
      setData([]); // Set an empty array on failure
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhoneNumber = (phoneNumber) =>
    /^[0-9]{10,15}$/.test(phoneNumber);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate email and phone number
    if (form.email && !validateEmail(form.email)) {
      notifyError("Invalid email format.");
      return;
    }
    if (form.phoneNumber && !validatePhoneNumber(form.phoneNumber)) {
      notifyError("Invalid phone number format.");
      return;
    }

    // Construct the payload
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      emailConfirmed: Boolean(form.emailConfirmed),
      phoneNumberConfirmed: Boolean(form.phoneNumberConfirmed),
      role: typeof form.role === "string" ? form.role.toUpperCase() : "CLERK",
      ...(editingRecord ? {} : { password: form.password.trim() }), // Add password only when creating
    };

    try {
      if (editingRecord) {
        // Update user
        await updateUser(editingRecord.id, payload);
        notifySuccess("User updated successfully.");
      } else {
        // Add new user
        await addUser(payload);
        notifySuccess("User added successfully.");
      }

      // Close modal and refresh data
      setModalVisible(false);
      fetchClerks();
    } catch (error) {
      // Handle API errors
      notifyError(
        error.response?.data?.message || "Failed to save user. Please try again."
      );
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (record) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the user ${record.firstName} ${record.lastName}?`
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(record.id);
      notifySuccess("User deleted successfully");
      fetchClerks();
    } catch (error) {
      notifyError("Failed to delete user");
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
      <h2>Clerk Management</h2>

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

      {/* Add user */}
      <button
        className="btn btn-primary user-management__add-button mb-3"
        onClick={() => {
          setForm({
            firstName: "",
            lastName: "",
            email: "",
            emailConfirmed: false,
            phoneNumber: "",
            phoneNumberConfirmed: false,
            role: "CLERK",
            password: "",
          });
          setEditingRecord(null);
          setModalVisible(true);
        }}
      >
        Add Clerk
      </button>

      {/* Table user */}
      <table className="table table-striped user-management__table">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Email Confirmed</th>
            <th>Phone Number</th>
            <th>Phone Confirmed</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td className="col-name">{user.firstName}</td>
              <td className="col-name">{user.lastName}</td>
              <td className="col-email">{user.email}</td>
              <td>{user.emailConfirmed ? "Yes" : "No"}</td>
              <td className="col-phone">{user.phoneNumber}</td>
              <td>{user.phoneNumberConfirmed ? "Yes" : "No"}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm user-management__edit-button me-2"
                  onClick={() => {
                    setForm(user);
                    setEditingRecord(user);
                    setModalVisible(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm user-management__delete-button"
                  onClick={() => handleDelete(user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Page */}
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

      {/* Modal add/edit user */}
      {modalVisible && (
        <div
          className="modal show d-block user-management__modal"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRecord ? "Edit Clerk" : "Add Clerk"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  {/* First Name & Last Name */}
                  <div className="form-inline-group">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingFirstName"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        required
                      />
                      <label htmlFor="floatingFirstName">First Name</label>
                    </div>
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingLastName"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        required
                      />
                      <label htmlFor="floatingLastName">Last Name</label>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="floatingEmail"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                    <label htmlFor="floatingEmail">Email</label>
                  </div>

                  {/* Email Confirmed */}
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="emailConfirmed"
                      checked={form.emailConfirmed}
                      onChange={(e) =>
                        setForm({ ...form, emailConfirmed: e.target.checked })
                      }
                    />
                    <label className="form-check-label" htmlFor="emailConfirmed">
                      Email Confirmed
                    </label>
                  </div>

                  {/* Phone Number */}
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingPhoneNumber"
                      placeholder="Phone Number"
                      value={form.phoneNumber}
                      onChange={(e) =>
                        setForm({ ...form, phoneNumber: e.target.value })
                      }
                    />
                    <label htmlFor="floatingPhoneNumber">Phone Number</label>
                  </div>

                  {/* Phone Confirmed */}
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="phoneNumberConfirmed"
                      checked={form.phoneNumberConfirmed}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phoneNumberConfirmed: e.target.checked,
                        })
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="phoneNumberConfirmed"
                    >
                      Phone Confirmed
                    </label>
                  </div>

                  {/* Role */}
                  <div className="form-group mb-3">
                    <label htmlFor="roleSelect">Role</label>
                    <select
                      className="form-control"
                      id="roleSelect"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="CLERK">Clerk</option>
                    </select>
                  </div>

                  {/* Password */}
                  {!editingRecord && (
                    <div className="form-floating mb-3">
                      <div className="user-management__modal">
                        <div className="input-group">
                          <input
                            type={passwordVisible ? "text" : "password"}
                            className="form-control"
                            id="password"
                            value={form.password}
                            onChange={(e) =>
                              setForm({ ...form, password: e.target.value })
                            }
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                          >
                            <FontAwesomeIcon
                              icon={passwordVisible ? faEyeSlash : faEye}
                            />
                          </button>
                        </div>
                      </div>
                      <label htmlFor="floatingPassword">Password</label>
                    </div>
                  )}

                  {/* Buttons */}
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

export default ClerkManagement;
