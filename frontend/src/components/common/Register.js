import React, { useState } from 'react';
import '../../assets/css/Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function RegisterPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();    
  };

  return (    
    <div className="register-container">      
      <h2>SIGN UP</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input 
            type="email" 
            placeholder="Email" 
            className="input-field" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <input 
            type={passwordVisible ? "text" : "password"} 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
          </span>
        </div>
        <div className="input-container">
          <input 
            type={passwordVisible ? "text" : "password"} 
            placeholder="Confirm Password" 
            className="input-field" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="register-button">
          SIGN UP
        </button>
      </form>
      <div className="login-prompt">
        <p>Already have an account? <a href="/login">SIGN IN</a></p>
      </div>      
    </div>
  );
}

export default RegisterPage;
