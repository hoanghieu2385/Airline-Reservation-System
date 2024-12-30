// src/components/ResetPasswordPage/ResetPasswordPage.js

import React, { useState, useEffect } from "react";
import { resetPassword } from "../../services/authApi";
import "../../assets/css/ResetPasswordPage.css";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Extract token and email from query parameters
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenParam = query.get("token");
    const emailParam = query.get("email");

    console.log("Extracted Token:", tokenParam);
    console.log("Extracted Email:", emailParam);

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError("The reset password link is invalid.");
    }
  }, [location.search]);

  // Function to validate strong password
  const validatePassword = (password) => {
    // At least 8 characters, including uppercase, lowercase, number, and special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check if token and email are set
    if (!token || !email) {
      setError("The reset password link is invalid.");
      return;
    }

    // Validate input fields
    if (!newPassword || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
      );
      return;
    }

    setIsLoading(true);
    try {
      // Send reset password request
      console.log('Sending data:', { email: email.trim(), token: token, newPassword: newPassword });

      const response = await resetPassword({
        email: email.trim(),
        token: token,
        newPassword: newPassword,
      });
      console.log("Response:", response); // Log response for debugging

      setSuccess(
        "Your password has been successfully updated. You will be redirected to the login page."
      );
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Error details:", err); // Log detailed error

      let errorMessage = "Failed to reset password. Please try again later.";

      if (err.response) {
        console.log("Error response:", err.response); // Log response error

        const errorData = err.response.data;
        console.log("Error Data:", errorData); // Log errorData to check structure

        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }

        if (errorData?.errors) {
          if (Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.join(" ");
          } else if (typeof errorData.errors === "string") {
            errorMessage = errorData.errors;
          } else {
            errorMessage = "Failed to reset password.";
          }
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password__container">
      <div className="reset-password__form">
        <h2>Reset Password</h2>

        {error && (
          <div className="reset-password__error-message" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="reset-password__success-message" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Hidden field to store email */}
          <input
            type="hidden"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="reset-password__input-container">
            <label htmlFor="newPassword" className="reset-password__label">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className="reset-password__input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="reset-password__input-container">
            <label htmlFor="confirmPassword" className="reset-password__label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="reset-password__input"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className={`reset-password__submit-button ${
              isLoading ? "reset-password__submit-button--loading" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="reset-password__back-to-login">
          <a href="/login" className="reset-password__link">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
