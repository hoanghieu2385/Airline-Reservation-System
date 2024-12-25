import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import AirlinesManagement from "../components/admin/AirlinesManagement";
import AirportsManagement from "../components/admin/AirportsManagement";
import CitiesManagement from "../components/admin/CitiesManagement";
import ClientManagement from "../components/admin/ClientManagement";
import ClerkManagement from "../components/admin/ClerkManagement";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/airlines" element={<AirlinesManagement />} />
        <Route path="/airports" element={<AirportsManagement />} />
        <Route path="/cities" element={<CitiesManagement />} />
        <Route path="clients" element={<ClientManagement />} />
        <Route path="/clerks" element={<ClerkManagement />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
