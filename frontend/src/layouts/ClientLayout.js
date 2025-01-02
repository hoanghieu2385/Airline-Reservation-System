// src/layouts/MainLayout.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ClientLayout = ({ children }) => {
    const location = useLocation();
    const isIndexPage = location.pathname === '/';

    useEffect(() => {
        // Add or remove index-page class from body based on current route
        if (isIndexPage) {
            document.body.classList.add('index-page');
        } else {
            document.body.classList.remove('index-page');
        }

        // Cleanup
        return () => {
            document.body.classList.remove('index-page');
        };
    }, [isIndexPage]);

    return (
        <div>
            <Header />
            <main style={{ minHeight: '80vh', padding: isIndexPage ? '0' : '0px 0px 20px 0px' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default ClientLayout;