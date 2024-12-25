import React, { useState } from "react";
import { forgotPassword } from "../../services/authApi";
import "../../assets/css/ForgotPassword.css"; // Import CSS

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email address.");
      return;
    }

    try {
      await forgotPassword({ email });
      setSuccess("Password reset link sent to your email.");
      setError("");
    } catch (err) {
      setError(err.response?.data || "Failed to send reset link. Try again later.");
      setSuccess("");
    }
  };

  return (
    <div className="forgot-password__form">
      <h2>Forgot Password</h2>
      {error && <div className="forgot-password__error-message">{error}</div>}
      {success && <div className="forgot-password__success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="forgot-password__input-container">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="forgot-password__submit-button">
          Send Reset Link
        </button>
      </form>
      <div className="forgot-password__back-to-login">
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
