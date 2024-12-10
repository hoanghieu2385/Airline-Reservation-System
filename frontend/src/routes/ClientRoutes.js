// src/routes/ClientRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/client/HomePage";
import PrivacyPolicy from "../pages/client/PrivacyPolicy";
import Policies from "../pages/client/Policies";
import Checkout from "../pages/client/Checkout";
import ClientLayout from "../layouts/ClientLayout";

function ClientRoutes() {
    return (
        <ClientLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/checkoutdetail" element={<Checkout />} />
            </Routes>
        </ClientLayout>
    );
}

export default ClientRoutes;
