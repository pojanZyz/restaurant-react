import React from "react";
import logo from "../img/logo_restoran.png";
import { NavLink, useLocation } from "react-router-dom";
import useAuth from "../js/useAuth";

const CashierNavbar = () => {
    const {token, userData, tokenLoading} = useAuth()
  const location = useLocation();

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
          to={"/cashier/history"}
          className={({ isActive }) => (isActive ? "active-nav" : "no-act-nav")}
        >
          <span>Order History</span>
        </NavLink>
        <div className="border-sep">
            
        </div>
        <div className="cas-profile">
          <span>{userData?.useremail || "Loading.."}</span>
          <i className="bi bi-person-circle"></i>
        </div>
      </div>
    </nav>
  );
};

export default CashierNavbar;
