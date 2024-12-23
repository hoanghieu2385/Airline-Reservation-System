import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/AdminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <header className="header">
        <h1>Admin Dashboard</h1>
      </header>
      <div className="layout-container">
        <aside className="sider">
          <nav>
            <ul className="menu">
              <li className="menu-item">
                <Link to="/admin">Dashboard</Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/airlines">Manage Airlines</Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/airports">Manage Airports</Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/cities">Manage Cities</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
