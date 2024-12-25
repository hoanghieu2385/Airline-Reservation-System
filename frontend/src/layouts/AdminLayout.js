import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/css/Admin/AdminLayout.css";

const AdminLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

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
                <Link to="/admin" className={isActive("/admin")}>Dashboard</Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/airlines" className={isActive("/admin/airlines")}>Manage Airlines</Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/airports" className={isActive("/admin/airports")}>Manage Airports</Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/cities" className={isActive("/admin/cities")}>Manage Cities</Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/users" className={isActive("/admin/users")}>Manage Users</Link>
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
