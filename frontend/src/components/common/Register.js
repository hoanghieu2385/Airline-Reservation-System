import React, { useState } from 'react';
import '../../assets/css/Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { register } from '../../services/authApi';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordConditions, setPasswordConditions] = useState({
    hasUppercase: false,
    hasSpecialChar  : false,
    hasMinLength: false,
  });

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    setPasswordConditions({
      hasUppercase: /[A-Z]/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      hasMinLength: value.length >= 8,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateEmail(email)) {
      setError('Invalid email address.');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    if (!passwordConditions.hasUppercase || !passwordConditions.hasSpecialChar || !passwordConditions.hasMinLength) {
      setError('Password does not meet the required conditions.');
      return;
    }
  
    try {
      const response = await register({ email, password, role: 'USER' });
      setSuccess('Registration successful! Redirecting to login page...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration failed', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again!';
      setError(errorMessage);
    }
  };  

  const hasErrors = !!error;

  return (
    <div className={`register-form ${hasErrors ? 'register-form--error' : ''}`}>
      <h2 className="register-form__title">REGISTER</h2>
      {error && <div className="register-form__error-message">{error}</div>}
      {success && <div className="register-form__success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="register-form__input-container">
          <input
            type="email"
            placeholder="Email"
            className={`register-form__input ${
              !validateEmail(email) && email.length > 0 ? 'register-form__input--invalid' : ''
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div
          className="register-form__input-container"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder="Password"
            className={`register-form__input ${
              (!passwordConditions.hasMinLength ||
                !passwordConditions.hasSpecialChar ||
                !passwordConditions.hasUppercase) &&
              password.length > 0
                ? 'register-form__input--invalid'
                : ''
            }`}
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {hovered && (
            <span className="register-form__password-toggle-icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </span>
          )}
        </div>
        
        <div
          className="register-form__input-container"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder="Confirm Password"
            className={`register-form__input ${
              confirmPassword !== password && confirmPassword.length > 0
                ? 'register-form__input--invalid'
                : ''
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {hovered && (
            <span className="register-form__password-toggle-icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </span>
          )}
        </div>
        <div className="register-form__password-hints">
          <p
            className={
              passwordConditions.hasUppercase
                ? 'register-form__password-hint register-form__password-hint--valid'
                : 'register-form__password-hint register-form__password-hint--invalid'
            }
          >
            {passwordConditions.hasUppercase ? '✔' : '✖'} At least one uppercase letter
          </p>
          <p
            className={
              passwordConditions.hasSpecialChar
                ? 'register-form__password-hint register-form__password-hint--valid'
                : 'register-form__password-hint register-form__password-hint--invalid'
            }
          >
            {passwordConditions.hasSpecialChar ? '✔' : '✖'} At least one special character
          </p>
          <p
            className={
              passwordConditions.hasMinLength
                ? 'register-form__password-hint register-form__password-hint--valid'
                : 'register-form__password-hint register-form__password-hint--invalid'
            }
          >
            {passwordConditions.hasMinLength ? '✔' : '✖'} Minimum 8 characters
          </p>
        </div>
        <button type="submit" className="register-form__button">
          SIGN UP
        </button>
      </form>
      <div className="register-form__login-prompt">
        <p>
          Already have an account? <a href="/login">SIGN IN</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
