import React, { useState, useEffect } from "react";
import { changePassword } from "../../services/clerkApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/ClientDashboard/Security.css";

const ClerkSecurity = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordVisible, setPasswordVisible] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [passwordConditions, setPasswordConditions] = useState({
        hasUppercase: false,
        hasSpecialChar: false,
        hasMinLength: false,
    });

    const [clerkId, setClerkId] = useState(null);

    // Lấy clerkId từ sessionStorage khi component được mount
    useEffect(() => {
        const storedClerkId = sessionStorage.getItem("clerkId");
        if (storedClerkId) {
            setClerkId(storedClerkId);
        } else {
            alert("Clerk ID not found. Please log in again.");
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "newPassword") {
            setPasswordConditions({
                hasUppercase: /[A-Z]/.test(value),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
                hasMinLength: value.length >= 8,
            });
        }
    };

    const toggleVisibility = (field) => {
        setPasswordVisible((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!clerkId) {
            alert("Clerk ID is missing. Please log in again.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!passwordConditions.hasUppercase || !passwordConditions.hasSpecialChar || !passwordConditions.hasMinLength) {
            alert("Password does not meet the required conditions.");
            return;
        }

        try {
            await changePassword(clerkId, formData);
            alert("Password changed successfully.");
            setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setPasswordConditions({
                hasUppercase: false,
                hasSpecialChar: false,
                hasMinLength: false,
            });
        } catch (error) {
            console.error("Failed to change password:", error);
            alert("Failed to change password.");
        }
    };

    return (
        <div className="security-container">
            <h2>Account Security</h2>
            <form onSubmit={handleSubmit} className="security-form">
                <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input">
                        <input
                            type={passwordVisible.current ? "text" : "password"}
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                        <FontAwesomeIcon
                            icon={passwordVisible.current ? faEyeSlash : faEye}
                            className="toggle-icon"
                            onClick={() => toggleVisibility("current")}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input">
                        <input
                            type={passwordVisible.new ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            className={
                                formData.newPassword &&
                                    (!passwordConditions.hasMinLength ||
                                        !passwordConditions.hasSpecialChar ||
                                        !passwordConditions.hasUppercase)
                                    ? "input-invalid"
                                    : ""
                            }
                        />
                        <FontAwesomeIcon
                            icon={passwordVisible.new ? faEyeSlash : faEye}
                            className="toggle-icon"
                            onClick={() => toggleVisibility("new")}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="password-input">
                        <input
                            type={passwordVisible.confirm ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className={
                                formData.confirmPassword &&
                                    formData.confirmPassword !== formData.newPassword
                                    ? "input-invalid"
                                    : ""
                            }
                        />
                        <FontAwesomeIcon
                            icon={passwordVisible.confirm ? faEyeSlash : faEye}
                            className="toggle-icon"
                            onClick={() => toggleVisibility("confirm")}
                        />
                    </div>
                    <div className="password-hints">
                        <p className={`password-hint ${passwordConditions.hasUppercase ? "valid" : ""}`}>
                            {passwordConditions.hasUppercase ? "✔" : "✖"} At least one uppercase letter
                        </p>
                        <p className={`password-hint ${passwordConditions.hasSpecialChar ? "valid" : ""}`}>
                            {passwordConditions.hasSpecialChar ? "✔" : "✖"} At least one special character
                        </p>
                        <p className={`password-hint ${passwordConditions.hasMinLength ? "valid" : ""}`}>
                            {passwordConditions.hasMinLength ? "✔" : "✖"} Minimum 8 characters
                        </p>
                    </div>
                </div>
                <button type="submit" className="btn-primary-change-pass">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default ClerkSecurity;