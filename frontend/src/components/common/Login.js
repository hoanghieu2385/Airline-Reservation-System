import React, { useState } from 'react';
import '../../assets/css/Login.css';
import Header from "./Header";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (    
    <div>
      <Header />
      <div className="login-container">        
        <h2>SIGN IN</h2>
        <form>
          <div className="input-container">
            <input 
              type="email" 
              placeholder="Email" 
              className="input-field" 
            />
          </div>
          <div className="input-container">
            <input 
              type={passwordVisible ? "text" : "password"} 
              placeholder="Password" 
              className="input-field" 
            />
            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
            </span>
          </div>
          <div className="forgot-password">
            <a href="/forgotPassword">Forgot Password?</a>
          </div>
          <button type="submit" className="login-button">
            SIGN IN
          </button>
        </form>
        <div className="register-prompt">
          <p>Need an account? <a href="/register">SIGN UP</a></p>
        </div>      
      </div>
    </div>    
  );
}

export default LoginPage;
