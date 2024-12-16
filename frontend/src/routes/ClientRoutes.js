// src/routes/ClientRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/client/HomePage";
import Policies from "../pages/client/Policies";
import Checkout from "../pages/client/Checkout";
import ClientLayout from "../layouts/ClientLayout";
import Login from "../components/common/Login"
import Register from "../components/common/Register"
import Eticket from "../pages/client/Eticket";

function ClientRoutes() {
    return (
        <ClientLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route path="/policies" element={<Policies />} />
                <Route path="/checkoutdetail" element={<Checkout />} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>}/>\
                <Route path="/eticket" element={<Eticket/>}/>\
            </Routes>
        </ClientLayout>
    );
}

export default ClientRoutes;
