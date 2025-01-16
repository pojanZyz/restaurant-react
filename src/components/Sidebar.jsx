import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../js/useAuth";
import "../css/app.css";
import logo from "../img/logo_restoran.png";

const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const { token, userData, getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State untuk toggle dropdown akun
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false); // State untuk toggle dropdown login/register
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Referensi untuk dropdown akun
  const authDropdownRef = useRef(null); // Referensi untuk dropdown login/register
  const sidebarRef = useRef(null); // Referensi untuk sidebar

  useEffect(() => {
    if (userData?.role !== "customer") {
      if (userData?.role === "cashier") {
        navigate("/cashier");
      }
    }
  }, [token, userData]);

  // Logout handler
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
      if (
        authDropdownRef.current &&
        !authDropdownRef.current.contains(event.target)
      ) {
        setAuthDropdownOpen(false);
      }
      // Tutup sidebar jika klik di luar sidebar
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      <aside
        id="sidebar"
        className={`poppins-regular ${isOpen ? "open" : "closed"}`}
        ref={sidebarRef} // Menambahkan ref untuk sidebar
      >
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
                  <div
                    className="dropdown"
                    ref={dropdownRef}
                  >
                    <button
                      className="dropdown-toggle poppins-regular"
                      onClick={toggleDropdown}
                    >
                      <i className="bi bi-person-fill-gear logout-logo"> </i>{" "}
                      <span> Account</span>{" "}
                      <i
                        className={`bi bi-chevron-${
                          dropdownOpen ? "left" : "right"
                        } logout-logo`}></i>
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
                  <div
                    className="dropdown"
                    ref={authDropdownRef}
                  >
                    <button
                      className="dropdown-toggle poppins-regular"
                      onClick={toggleAuthDropdown}
                    >
                      <i className="bi bi-person-fill-gear logout-logo"> </i>{" "}
                      <span className="logout-logo"> Account</span>{" "}
                      <i
                        className={`bi bi-chevron-${
                          authDropdownOpen ? "left" : "right"
                        } logout-logo`}></i>
                    </button>
                    {authDropdownOpen && (
                      <div className="dropdown-menu">
                        <NavLink
                          to="/login"
                          className="dropdown-item poppins-regular"
                        >
                          <span>
                            <i className="bi bi-box-arrow-right"> </i> Login
                          </span>
                        </NavLink>
                        <NavLink
                          to="/register"
                          className="dropdown-item poppins-regular"
                        >
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
