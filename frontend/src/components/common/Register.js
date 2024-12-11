import React, { useState } from 'react';
import '../../assets/css/Login.css';
import Header from "./Header";

function RegisterPage() {
  const [passwordVisible] = useState(false);

  return (    
    <div>
      <Header/>
      <div className="login-container">        
        <h2>SIGN UP</h2>
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
          <div className="input-container">
              <input 
                type="Password" 
                placeholder="Corfirm Password" 
                className="input-field" 
              />
          </div>
          <button type="submit" className="login-button">
            SIGN UP
          </button>
        </form>
        <div className="register-prompt">
          <p>Already have an account? <a href="/login">SIGN IN</a></p>
        </div>      
      </div>
    </div>    
  );
}

export default RegisterPage;
