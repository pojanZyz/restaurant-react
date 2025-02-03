import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import logo from "../../img/logo_restoran.png";
import useAuth from "../../js/useAuth";
import AccountPopup from "../AccountPopup";

const CashierNavbar = () => {
  const sidebarRef = useRef(null);
  const { token, userData, tokenLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [showAccountPopup, setShowAccountPopup] = useState(false);

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

  return (
    <nav className="navbar-con">
      <div className="cas-logo-con">
        <img src={logo} alt="logo" loading="lazy" />
        <h5 className="agu-display">CafeCoding</h5>
      </div>
      <div className="quicksand navs-con">
        <NavLink
          to={"/cashier"}
          className={({ isActive }) => (isActive ? "active-nav" : "no-act-nav")}
          end
        >
          <span>Cashier</span>
        </NavLink>
        <NavLink
          to={"/cashier/reservation"}
          className={({ isActive }) => (isActive ? "active-nav" : "no-act-nav")}
        >
          <span>Cashier-Res</span>
        </NavLink>
        <NavLink
          to={"/cashier/history"}
          className={({ isActive }) => (isActive ? "active-nav" : "no-act-nav")}
        >
          <span>History</span>
        </NavLink>
        <div className="border-sep"></div>
        <NavLink to="/" className={"no-act-nav"}>
          <i className="bi bi-house-fill"></i> <span>Common</span>
        </NavLink>
        <button
          className="cas-profile poppins-regular"
          onClick={() => setShowAccountPopup(!showAccountPopup)}
        >
          <i className="bi bi-person-circle"></i>
        </button>
      </div>

      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}
      <aside
        id="cas-sidebar"
        className={`poppins-regular ${isOpen ? "open" : "closed"}`}
        ref={sidebarRef}
      >
        <div className="top-side">
          {/* Sidebar header */}
          <div className="side-head">
            <img src={logo} alt="logo-resto" />
            <h3 className="agu-display">CafeCoding</h3>
          </div>

          {/* Menu Navigasi */}
          <hr />
          <nav className="box-menu">
            <NavLink to="/cashier" end onClick={() => setIsOpen(false)}>
              <i className="bi bi-bag-check-fill"></i> <span>Cashier</span>
            </NavLink>

            <NavLink to="/cashier/reservation" onClick={() => setIsOpen(false)}>
              <i className="bi bi-calendar-check"></i> <span>Cashier-Res</span>
            </NavLink>

            <NavLink to="/cashier/history" onClick={() => setIsOpen(false)}>
              <i className="bi bi-journal-text"></i> <span>History</span>
            </NavLink>
          </nav>
        </div>

        {/* Account and authentication dropdown */}
        <hr />
        <div className="account-container">
          {tokenLoading ? (
            ""
          ) : token ? (
            <>
              <NavLink to="/">
                <i className="bi bi-house-fill"></i> <span>Common</span>
              </NavLink>
              <button
                className="logout-btn poppins-regular"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </>
          ) : (
            <NavLink to={"/register"}>
              <button className="regis-btn poppins-regular">JOIN MEMBER</button>
            </NavLink>
          )}
        </div>
      </aside>

      <button onClick={() => setIsOpen(!isOpen)} className="cas-hammenu">
        <i className={`bi ${isOpen ? "bi-x" : "bi-list"}`}></i>
      </button>
      <AccountPopup
        isVisible={showAccountPopup}
        onClose={() => setShowAccountPopup(!showAccountPopup)}
        onLogout={handleLogout}
        profile={userData}
        from={"cashier"}
      />
    </nav>
  );
};

export default CashierNavbar;
