// src/routes/ClientRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/client/HomePage";
import Policies from "../pages/client/Policies";
import CustomerDetail from "../pages/client/CustomerDetail";
import ClientLayout from "../layouts/ClientLayout";
import Login from "../components/common/Login"
import Register from "../components/common/Register"

function ClientRoutes() {
    return (
        <ClientLayout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/customerdetail" element={<CustomerDetail />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </ClientLayout>
    );
}

export default ClientRoutes;
