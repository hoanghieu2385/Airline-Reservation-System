import React, { useState } from 'react';
import '../../assets/css/Login.css';
import Header from "./Header";

function LoginPage() {
  const [passwordVisible] = useState(false);

  return (    
    <div>
      <Header/>
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
