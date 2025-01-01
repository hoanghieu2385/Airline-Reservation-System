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

    // Validate email format
    if (!validateEmail(email)) {
        setError("Invalid email address.");
        return;
    }

    try {
        // Attempt to log in using the provided email and password
        const response = await login({ email, password });

        // Extract necessary data from the API response
        const { token, roles, user } = response;

        // Save login details to sessionStorage
        sessionStorage.setItem("userId", user.id);       // Save user ID
        sessionStorage.setItem("userRole", roles[0]);    // Save the first role
        sessionStorage.setItem("userEmail", email);      // Save the user email
        sessionStorage.setItem("token", token);          // Save the JWT token

        setError("");        // Clear any existing errors
        setSuccess(true);    // Indicate successful login

        // Retrieve the redirect path if available
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");

        // Define default paths for each role
        const defaultPaths = {
            ADMIN: "/admin",
            CLERK: "/clerk",
            USER: "/",
        };

        // Determine the appropriate redirection path
        let navigatePath;
        if (redirectPath) {
            navigatePath = redirectPath; // Use the saved redirect path if available
        } else {
            // Use the role-based default path if no redirect is saved
            const primaryRole = roles.find(role => defaultPaths[role]);
            navigatePath = defaultPaths[primaryRole] || "/";
        }

        // Remove the redirect path from sessionStorage (to avoid accidental reuse)
        sessionStorage.removeItem("redirectAfterLogin");

        // Redirect the user after a short delay
        setTimeout(() => {
            navigate(navigatePath);
        }, 2000);

    } catch (error) {
        // Handle login errors
        setSuccess(false);
        setError(
            error.response?.data || "Login failed. Please check your email and password."
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
              className={`login-form__input ${email && !validateEmail(email)
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
            LOG IN
          </button>
        </form>
        <div className="login-form__register-prompt">
          <p>
            Need an account? <a href="/register">REGISTER</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;