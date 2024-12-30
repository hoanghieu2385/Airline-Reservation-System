// src/routes/ClerkRoutes.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import ClerkLayout from "../layouts/ClerkLayout";
import ClerkDashboard from "../pages/clerk/ClerkDashboard";
import ClerkGetFlight from "../components/clerk/ClerkGetFlight";
import ClerkGetAirlines from "../components/clerk/ClerkGetAirlines";
import ClerkGetAirports from "../components/clerk/ClerkGetAirports";
import ClerkGetClient from "../components/clerk/ClerkGetClient";

const ClerkRoutes = () => {
    return (
        <ClerkLayout>
            <Routes>
                <Route path="" element={<ClerkDashboard />} />
                <Route path="/clerk_flights" element={<ClerkGetFlight />} />
                <Route path="/clerk_airlines" element={<ClerkGetAirlines />} />
                <Route path="/clerk_airport" element={<ClerkGetAirports />} />
                <Route path="/clerk_client" element={<ClerkGetClient />} />
                
            </Routes>
        </ClerkLayout>
    );
};

export default ClerkRoutes;
