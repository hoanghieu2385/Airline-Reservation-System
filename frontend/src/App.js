import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
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
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
        </Router>
    );
}

export default App;
