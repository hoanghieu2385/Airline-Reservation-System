import React, { useState, useEffect } from "react";
import { resetPassword } from "../../services/authApi";
import "../../assets/css/ResetPasswordPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConditions, setPasswordConditions] = useState({
    hasUppercase: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });

  const location = useLocation();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validatePassword = (password) => {
    const conditions = {
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasMinLength: password.length >= 8,
    };
    setPasswordConditions(conditions);
    return (
      conditions.hasUppercase &&
      conditions.hasSpecialChar &&
      conditions.hasMinLength
    );
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenParam = query.get("token");
    const emailParam = query.get("email");

    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError("The reset password link is invalid.");
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token || !email) {
      setError("The reset password link is invalid.");
      return;
    }

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
      const response = await resetPassword({
        email: email.trim(),
        token: token,
        newPassword: newPassword,
      });
      setSuccess(
        "Your password has been successfully updated. You will be redirected to the login page."
      );
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      let errorMessage = "Failed to reset password. Please try again later.";
      if (err.response) {
        const errorData = err.response.data;
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
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
          <div className="reset-password__input-container">
            <label htmlFor="newPassword" className="reset-password__label">
              New Password
            </label>
            <div className="reset-password__input-wrapper">
              <input
                id="newPassword"
                type={passwordVisible ? "text" : "password"}
                className="reset-password__input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                disabled={isLoading}
                required
              />
              <span
                className="reset-password__password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <div className="reset-password__input-container">
            <label htmlFor="confirmPassword" className="reset-password__label">
              Confirm Password
            </label>
            <div className="reset-password__input-wrapper">
              <input
                id="confirmPassword"
                type={passwordVisible ? "text" : "password"}
                className="reset-password__input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <span
                className="reset-password__password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          <div className="reset-password__password-hints">
            <p
              className={
                passwordConditions.hasUppercase ? "valid-icon" : "invalid-icon"
              }
            >
              <FontAwesomeIcon
                icon={passwordConditions.hasUppercase ? faCheck : faTimes}
              />{" "}
              At least one uppercase letter
            </p>
            <p
              className={
                passwordConditions.hasSpecialChar
                  ? "valid-icon"
                  : "invalid-icon"
              }
            >
              <FontAwesomeIcon
                icon={passwordConditions.hasSpecialChar ? faCheck : faTimes}
              />{" "}
              At least one special character
            </p>
            <p
              className={
                passwordConditions.hasMinLength ? "valid-icon" : "invalid-icon"
              }
            >
              <FontAwesomeIcon
                icon={passwordConditions.hasMinLength ? faCheck : faTimes}
              />{" "}
              Minimum 8 characters
            </p>
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
