// src/routes/ClientRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/client/HomePage";
import PrivacyPolicy from "../pages/client/PrivacyPolicy";
import TermsAndConditions from "../pages/client/TermsAndConditions";
import ClientLayout from "../layouts/ClientLayout";

function ClientRoutes() {
    return (
        <ClientLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
            </Routes>
        </ClientLayout>
    );
}

export default ClientRoutes;
