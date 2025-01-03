import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../js/useAuth";
import "../css/app.css";
import logo from "../img/logo_restoran.png";

const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const { token, userData, getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State untuk toggle dropdown akun
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false); // State untuk toggle dropdown login/register
  const navigate = useNavigate();

  // logout handler
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
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.message || "Something went wrong",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown akun
  };

  const toggleAuthDropdown = () => {
    setAuthDropdownOpen(!authDropdownOpen); // Toggle dropdown login/register
  };

  // Mengubah ukuran body box berdasarkan status sidebar
  useEffect(() => {
    const bodyBox = document.querySelector(".body-box");
    const controlPanel = document.querySelector(".control-panel");
    const beranda = document.querySelector(".beranda");
    if (bodyBox) {
      bodyBox.style.marginLeft = isOpen ? "15%" : "0";
      bodyBox.style.width = isOpen ? "85%" : "100%";
      bodyBox.style.transition = "all 0.3s ease";
    }

    if (controlPanel) {
      controlPanel.style.width = isOpen ? "85vw" : "100vw";
    }
  }, [isOpen]);

  return (
    <div className="topBar-box">
      <div className="topBar">
        
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

        <div className="mail-box">
          <span>
            <a href="">
                <i className="bi bi-envelope top-mail"> </i>
            </a>
          </span>
        </div>
      </div>
      <aside id="sidebar" className={`poppins-regular ${isOpen ? "open" : "closed"}`}>
        <div className="container-sidebar">
          <div className="side-head none-head">
            <img src={logo} alt="logo-resto" />
            <h1 className="agu-display">CafeCoding</h1>
          </div>
          <nav className="box-menu">
            <hr className="none-head" />
            <ul>
              <li>
                <NavLink to="/">
                  <i className="bi bi-house-fill"></i>
                  <span>Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/menu">
                  <i className="bi bi-cart-fill"></i>
                  <span>Menu</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/order">
                  <i className="bi bi-calculator"></i>
                  <span>Order</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/reservation">
                  <i className="bi bi-bag-check-fill"></i>
                  <span>Reservation</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/loyalty">
                  <i className="bi bi-person-hearts"></i>
                  <span>Loyalty</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/feedback">
                  <i className="bi bi-envelope-paper-heart-fill"></i>
                  <span>FeedBack</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="logout-container">
          {loading ? (
            <p className="loading-proces">Processing...</p>
          ) : (
            <div className="auth-con poppins-regular">
              {token ? (
                <>
                  {/* Dropdown untuk akun */}
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle poppins-regular"
                      onClick={toggleDropdown}
                    >
                      <i className="bi bi-person-fill-gear logout-logo"> </i> <span> Account</span> <i className={`bi bi-chevron-${dropdownOpen ? "left" : "right"} logout-logo`} ></i>
                    </button>
                    {dropdownOpen && (
                      <div className="dropdown-menu">
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
                </>
              ) : (
                <>
                  {/* Dropdown untuk login/register */}
                  <div className="dropdown">
                    <button
                      className="dropdown-toggle poppins-regular"
                      onClick={toggleAuthDropdown}
                    >
                       <i class="bi bi-person-fill-gear logout-logo"> </i> <span className="logout-logo"> Account</span> <i className={`bi bi-chevron-${authDropdownOpen ? "left" : "right"} logout-logo`}></i>
                    </button>
                    {authDropdownOpen && (
                      <div className="dropdown-menu">
                        <NavLink to="/login" className="dropdown-item poppins-regular">
                          <span>
                            <i className="bi bi-box-arrow-right"> </i> Login
                          </span>
                        </NavLink>
                        <NavLink to="/register" className="dropdown-item poppins-regular">
                          <span>Register</span>
                        </NavLink>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
