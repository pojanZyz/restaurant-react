import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../js/useAuth";
import logo from "../img/logo_restoran.png"; 
import "../admin-css/admin-sidebar.css";

const AdminSidebar = () => {
  const [loading, setLoading] = useState(false); 
  const { token, userData, getToken } = useAuth(); 

  const navigate = useNavigate();

  useEffect(() => {
      if(token){
        if(userData.role === "customer"){
          navigate('/')
        }
      }
    }, [token])

  // Handler untuk logout
  const handleLogout = () => {
    setLoading(true);
    axios
      .delete("api/logout")
      .then((res) => {
        Swal.fire({
          icon: "info",
          title: "Information",
          text: res.data.message || "Logout success",
          showConfirmButton: false,
          timer: 2000,
        });
        getToken(null);
        navigate("/");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Something went wrong",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <aside id="admin-sidebar" className="poppins-regular">
      <div className="container-sidebar-admin">
        {/* Header Sidebar */}
        <div className="admin-side-head">
          <img src={logo} alt="logo-resto" />
          <h1 className="agu-display">CafeCoding</h1>
        </div>

        {/* Menu Navigasi */}
        <nav className="admin-box-menu">
          <hr />
          <ul>
            <li>
              <NavLink
                to="/admin"
                end
              >
                <i className="bi bi-house-fill"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/menu"
              >
                <i className="bi bi-cart-fill"></i>
                <span>Products</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/user"
              >
                <i className="bi bi-person-fill"></i>
                <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/order"
              >
                <i className="bi bi-bag-check-fill"></i>
                <span>Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/table"
              >
                <i className="bi bi-table"></i>
                <span>Tables</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/reservation"
              >
                <i className="bi bi-calendar-check"></i>
                <span>Reservations</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/comment"
              >
                <i className="bi bi-chat-left-dots-fill"></i>
                <span>Comments</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Logout Section */}
      <div className="logout-container">
        {loading ? (
          <p>Processing...</p>
        ) : (
          <div className="auth-con poppins-regular">
            <span className="username quicksand">
              Admin: {userData?.username || "Unknown"}
            </span>
            <button
              className="logout-btn poppins-regular"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right logout-icon"></i>
              <span>{loading ? "Wait..." : "Logout"}</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
