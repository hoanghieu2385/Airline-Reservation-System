import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AirlinesManagement from "../components/admin/AirlinesManagement";
import AirportsManagement from "../components/admin/AirportsManagement";
import CitiesManagement from "../components/admin/CitiesManagement";
import ClientManagement from "../components/admin/ClientManagement";
import ClerkManagement from "../components/admin/ClerkManagement";
import FlightManagement from "../components/admin/FlightManagement/FlightManagement";
import ReservationManagement from "../components/admin/ReservationsManagement";
import FlightRouteManagement from "../components/admin/FlightRouteManagement";
import AdminChangePassword from "../components/admin/AdminChangePassword";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reservations" element={<ReservationManagement/>} />
        <Route path="/flights" element={<FlightManagement />} />
        <Route path="/airlines" element={<AirlinesManagement />} />
        <Route path="/airports" element={<AirportsManagement />} />
        <Route path="/cities" element={<CitiesManagement />} />
        <Route path="/clients" element={<ClientManagement />} />
        <Route path="/clerks" element={<ClerkManagement />} />
        <Route path="/flight_route" element={<FlightRouteManagement />} />
        <Route path="/admin_security" element={<AdminChangePassword />} />

      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
