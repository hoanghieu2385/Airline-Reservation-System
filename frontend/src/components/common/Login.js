import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authApi";
import "../../assets/css/Login.css";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = sessionStorage.getItem("token");
    if (token) {
      // Redirect to dashboard or home if logged in
      navigate("/");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setError("Invalid email address.");
      return;
    }

    try {
      const response = await login({ email, password });

      const { token, roles, user } = response;

      // Log the extracted user object
      console.log("Extracted User:", user);

      // Save the userId in sessionStorage
      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("userRole", roles[0]);

      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("token", token);

      setError("");
      setSuccess(true);

      // Redirect based on role
      if (roles.includes("ADMIN")) {
        setTimeout(() => navigate("/admin"), 2000);
      } else if (roles.includes("CLERK")) {
        setTimeout(() => navigate("/clerk"), 2000);
      } else {
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      setSuccess(false);
      setError(
        error.response?.data ||
          "Login failed. Please check your email and password."
      );
    }
  };
  return (
    <div>
      <Header />
      <div className="login-form">
        <h2 className="login-form__title">LOGIN</h2>
        {error && <div className="login-form__error-message">{error}</div>}
        {success && (
          <div className="login-form__success-message">
            Login successful! Redirecting...
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="login-form__input-container">
            <input
              type="email"
              placeholder="Email"
              className={`login-form__input ${
                email && !validateEmail(email)
                  ? "login-form__input--invalid"
                  : ""
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div
            className="login-form__input-container"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              className="login-form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {hovered && (
              <span
                className="login-form__password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </span>
            )}
          </div>
          <div className="login-form__forgot-password">
            <a href="/forgotPassword">Forgot Password?</a>
          </div>
          <button type="submit" className="login-form__button">
            SIGN IN
          </button>
        </form>
        <div className="login-form__register-prompt">
          <p>
            Need an account? <a href="/register">SIGN UP</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;