import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../js/useAuth";
import logo from "../img/logo_restoran.png"; 
import "../admin-css/admin-sidebar.css";
import "../css/app.css";

const AdminSidebar = () => {
  const sidebarRef = useRef(null);
  const [loading, setLoading] = useState(false); 
  const { token, userData, getToken, tokenLoading } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

      useEffect(() => {
      
        const handleClickOutside = (event) => {
          if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsOpen(false); // Menutup sidebar jika klik di luar
          }
        };
      
     
        document.addEventListener("mousedown", handleClickOutside);
      
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
  

    useEffect(() => {
      if(token){
        if(userData.role === "customer"){
          navigate('/')
        }
        if(userData.role === "cashier"){
          navigate('/cashier')
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
    <div className="topBar-box">
      <div className="topBar topBar-Admin">
        <div className="profile-box">
          <a onClick={toggleSidebar} className="profile-btn">
            <i className="bi bi-list"></i>
          </a>
        </div>

        <div className="logo-container">
          <span>
            <NavLink to="/feedback">
              <div className="side-head">
                <img src={logo} alt="logo-resto" />
              </div>
            </NavLink>
          </span>
        </div>

        <div className="mail">
          <span>
            <a href="" className="admin-mail">
              <i className="bi bi-envelope top-mail-admin"></i>
            </a>
          </span>
        </div>
      </div>

      <aside
        id="admin-sidebar"
        className={`poppins-regular ${isOpen ? "open" : "closed"}`}
        ref={sidebarRef}
      >
        <div className="container-sidebar-admin">
          {/* Header Sidebar */}
          <div className="admin-side-head none-head">
            <img src={logo} alt="logo-resto" />
            <h1 className="agu-display">CafeCoding</h1>
          </div>

          {/* Menu Navigasi */}
          <nav className="admin-box-menu">
            <hr className="none-head" />
            <ul>
              <li>
                <NavLink to="/admin" end>
                  <i className="bi bi-house-fill"></i>
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/menu">
                  <i className="bi bi-cart-fill"></i>
                  <span>Products</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/user">
                  <i className="bi bi-person-fill"></i>
                  <span>Users</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/order">
                  <i className="bi bi-bag-check-fill"></i>
                  <span>Orders</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/discount">
                  <i className="bi bi-percent"></i>
                  <span>Discounts</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/table">
                  <i className="bi bi-table"></i>
                  <span>Tables</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/reservation">
                  <i className="bi bi-calendar-check"></i>
                  <span>Reservations</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/comment">
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
            <p className="loading-proces">Processing...</p>
          ) : (
            <div className="auth-con poppins-regular">
              <div className="dropdown">
                <button
                  className="dropdown-toggle poppins-regular"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <i className="bi bi-person-fill-gear logout-logo"></i>
                  <span> Account</span>
                  <i
                    className={`bi bi-chevron-${
                      dropdownOpen ? "left" : "right"
                    } logout-logo`}
                  ></i>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu dropdown-menu-admin">
                    <button
                      className="logout-btn poppins-regular"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right logout-icon"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default AdminSidebar;
