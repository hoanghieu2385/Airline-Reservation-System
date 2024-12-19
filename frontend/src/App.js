// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ClerkRoutes from "./routes/ClerkRoutes";
import Eticket from './pages/Eticket/Eticket';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/*" element={<AdminRoutes />} />

                <Route path="/clerk/*" element={<ClerkRoutes />} />

                <Route path="/*" element={<ClientRoutes />} />

                <Route path="/eticket" element={<Eticket />} />
            </Routes>
        </Router>
    );
}

export default App;
