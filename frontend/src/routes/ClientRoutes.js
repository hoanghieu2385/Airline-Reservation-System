// src/routes/ClientRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/client/HomePage";
import Policies from "../pages/client/Policies";
import Checkout from "../pages/client/Checkout";
import ClientLayout from "../layouts/ClientLayout";
import Login from "../components/common/Login";
import Register from "../components/common/Register";
import ClientDashboard from "../pages/client/ClientDashboard";

function ClientRoutes() {
    return (
        <ClientLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/policies" element={<Policies />} />
                <Route path="/checkoutdetail" element={<Checkout />} />

                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>}/>

                <Route path="/user/dashboard" element={<ClientDashboard />} />
            </Routes>
        </ClientLayout>
    );
}

export default ClientRoutes;
