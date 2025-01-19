import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import logo from "../img/logo_restoran.png";
import useAuth from "../js/useAuth";
import AccountPopup from "./AccountPopup";

const CashierNavbar = () => {
  const { token, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [showAccountPopup, setShowAccountPopup] = useState(false);

  useEffect(() => {
    if (token) {
      if (userData.role === "customer") {
        navigate("/");
      }
    }
  }, [token]);

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
      <div className="logo-con">
        <img src={logo} alt="logo" loading="lazy" />
        <h4 className="agu-display">CafeCoding</h4>
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
        <button
          className="cas-profile poppins-regular"
          onClick={() => setShowAccountPopup(!showAccountPopup)}
        >
          <span>{userData?.useremail || "Loading.."}</span>
          <i className="bi bi-person-circle"></i>
        </button>
      </div>
      <AccountPopup
        isVisible={showAccountPopup}
        onClose={() => setShowAccountPopup(!showAccountPopup)}
        onLogout={handleLogout}
        profile={userData}
      />
    </nav>
  );
};

export default CashierNavbar;
