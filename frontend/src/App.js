// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import ClerkRoutes from "./routes/ClerkRoutes";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/*" element={<AdminRoutes />} />

                <Route path="/clerk/*" element={<ClerkRoutes />} />

                <Route path="/*" element={<ClientRoutes />} />
            </Routes>
        </Router>
    );
}

export default App;
