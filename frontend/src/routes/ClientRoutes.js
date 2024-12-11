// src/routes/ClientRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/client/HomePage";
import PrivacyPolicy from "../pages/client/PrivacyPolicy";
import TermsAndConditions from "../pages/client/TermsAndConditions";
import ClientLayout from "../layouts/ClientLayout";
import Login from "../components/common/Login"
import Register from "../components/common/Register"

function ClientRoutes() {
    return (
        <ClientLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </ClientLayout>
    );
}

export default ClientRoutes;
