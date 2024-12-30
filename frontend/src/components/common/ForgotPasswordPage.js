import React, { useState } from "react";
import { forgotPassword } from "../../services/authApi";
import "../../assets/css/ForgotPassword.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setError("Invalid email address.");
      return;
    }

    setIsLoading(true);
    try {
      // Log để kiểm tra dữ liệu gửi đi
      console.log('Sending data:', { email: trimmedEmail });
      
      const response = await forgotPassword({ email: trimmedEmail });
      console.log('Response:', response); // Log response để debug
      
      setSuccess("Password reset link sent to your email.");
      setEmail("");
    } catch (err) {
      console.error('Error details:', err); // Log chi tiết lỗi
      
      let errorMessage = "Failed to send reset link. Please try again later.";
      
      if (err.response) {
        console.log('Error response:', err.response); // Log response error
        
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password__container">
      <div className="forgot-password__form">
        <h2>Forgot Password</h2>
        
        {error && (
          <div className="forgot-password__error-message" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="forgot-password__success-message" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="forgot-password__input-container">
            <label htmlFor="email" className="forgot-password__label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="forgot-password__input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className={`forgot-password__submit-button ${
              isLoading ? "forgot-password__submit-button--loading" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="forgot-password__back-to-login">
          <a href="/login" className="forgot-password__link">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;