import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/Admin/AdminLayout.css";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // check login session
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {

      navigate("/login");
    }
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userEmail");
    sessionStorage.clear();

    navigate("/login");
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
                <Link to="/admin" className={`menu-link ${isActive("/admin")}`}>
                  Dashboard
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/reservations" className={`menu-link ${isActive("/admin/reservations")}`}>
                  Manage Reservations
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/flights" className={`menu-link ${isActive("/admin/flights")}`}>
                  Manage Flights
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/clients" className={`menu-link ${isActive("/admin/clients")}`}>
                  Manage Clients
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/clerks" className={`menu-link ${isActive("/admin/clerks")}`}>
                  Manage Clerks
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/airlines" className={`menu-link ${isActive("/admin/airlines")}`}>
                  Manage Airlines
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/airports" className={`menu-link ${isActive("/admin/airports")}`}>
                  Manage Airports
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/cities" className={`menu-link ${isActive("/admin/cities")}`}>
                  Manage Cities
                </Link>
              </li>
              {/* <li className="menu-item">
                <Link to="/admin/flightseatallocation" className={`menu-link ${isActive("/admin/flightseatallocation")}`}>
                  Manage Flight Seat Allocation
                </Link>
              </li> */}
              <li className="menu-item">
                <Link to="/admin/flight_route" className={`menu-link ${isActive("/admin/flight_route")}`}>
                  Manage Flight Route
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/admin_security" className={`menu-link ${isActive("/admin/admin_security")}`}>
                  Security
                </Link>
              </li>
              <li className="menu-item">
                <button className="menu-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
