import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../../js/useAuth";
import logo from "../../img/logo_restoran.png";
import "./sidebar.css";

const Sidebar = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { token, userData, tokenLoading } = useAuth();
  const navigate = useNavigate();

  const sidebarRef = useRef(null);

  // Handle logout functionality
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
          text: err.response?.data?.message || "Something went wrong",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("sidebar");
      const toggleButton = document.querySelector(".top-bar button");

      // Tutup sidebar hanya jika klik terjadi di luar sidebar dan tombol toggle
      if (
        isOpen &&
        sidebar &&
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)
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
    <>
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}
      {/* Sidebar navigation */}
      <aside
        id="sidebar"
        className={`poppins-regular ${isOpen ? "open" : "closed"}`}
        ref={sidebarRef}
      >
        <div className="top-side">
          {/* Sidebar header */}
          <div className="side-head">
            <img src={logo} alt="logo-resto" />
            <h3 className="agu-display">CafeCoding</h3>
          </div>

          {/* Navigation links */}
          <hr />
          <nav className="box-menu">
            <NavLink to="/" onClick={() => setIsOpen(false)}>
              <i className="bi bi-house-fill"></i> <span>Home</span>
            </NavLink>

            <NavLink to="/menu" onClick={() => setIsOpen(false)}>
              <i className="bi bi-cart-fill"></i> <span>Menu</span>
            </NavLink>

            <NavLink to="/order" onClick={() => setIsOpen(false)}>
              <i className="bi bi-calculator"></i> <span>Order</span>
            </NavLink>

            <NavLink to="/reservation" onClick={() => setIsOpen(false)}>
              <i className="bi bi-bag-check-fill"></i> <span>Reservation</span>
            </NavLink>

            <NavLink to="/feedback" onClick={() => setIsOpen(false)}>
              <i className="bi bi-envelope-paper-heart-fill"></i>{" "}
              <span>Feedback</span>
            </NavLink>
          </nav>
        </div>

        {/* Account and authentication dropdown */}
        <hr />
        <div className="account-container">
          {tokenLoading ? (
            ""
          ) : token ? (
            userData?.role === "admin" ? (
              <NavLink to="/admin">
                <i className="bi bi-bar-chart-line-fill"></i> <span>Admin</span>
              </NavLink>
            ) : userData?.role === "cashier" ? (
              <NavLink to="/cashier">
                <i className="bi bi-calculator-fill"></i> <span>Cashier</span>
              </NavLink>
            ) : (
              <NavLink to="/loyalty">
                <i className="bi bi-person-hearts"></i> <span>Loyalty</span>
              </NavLink>
            )
          ) : (
            <NavLink to={"/register"}>
              <button className="regis-btn poppins-regular">JOIN MEMBER</button>
            </NavLink>
          )}
        </div>
      </aside>

      {/*top bar for tablet/hp */}
      <nav className="top-bar">
        <div className="logo-con">
          <img src={logo} alt="logo-resto" />
          <h5 className="agu-display">CafeCoding</h5>
        </div>
        <button onClick={() => setIsOpen(!isOpen)}>
          <i className={`bi ${isOpen ? "bi-x" : "bi-list"}`}></i>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
