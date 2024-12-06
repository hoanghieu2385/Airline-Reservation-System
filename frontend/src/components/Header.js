// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header style={{ backgroundColor: '#007BFF', color: 'white', padding: '10px 20px' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Booking Platform</h1>
                <div>
                    <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>
                        Home
                    </Link>
                    <Link to="/terms" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>
                        Terms
                    </Link>
                    <Link to="/policy" style={{ color: 'white', textDecoration: 'none' }}>
                        Privacy
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
