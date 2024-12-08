// src/layouts/MainLayout.js
import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ClientLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main style={{ minHeight: '80vh', padding: '0 0 20px 0' }}>{children}</main>
            <Footer />
        </div>
    );
};

export default ClientLayout;