// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import TermsAndConditions from '../pages/TermsAndConditions';
import PrivacyPolicy from '../pages/PrivacyPolicy';

const AppRoutes = () => {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<h1>Welcome to the Booking Platform</h1>} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/policy" element={<PrivacyPolicy />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default AppRoutes;
