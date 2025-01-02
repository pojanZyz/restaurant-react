import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../js/useAuth";
import "../css/app.css";
import logo from "../img/logo_restoran.png";

const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const { token, userData, tokenLoading } = useAuth();  

  const navigate = useNavigate()

  //logout handler
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
          timer: 2000
        })
        navigate('/')
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.message || "Something went wrong",
        })
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <aside id="sidebar" className="poppins-regular">
      <div className="container-sidebar ">
        <div className="side-head">
          <img src={logo} alt="logo-resto" />
          <h1 className="agu-display">CafeCoding</h1>
        </div>
        <nav className="box-menu">
          <hr />
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
        {tokenLoading ? (
          <p>Processing...</p>
        ) : (
          <div className="auth-con poppins-regular">
            {token ? (
              <>
                <span className="username quicksand">
                  Welcome back, {userData.username}!
                </span>
                <button
                  className="logout-btn poppins-regular"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right logout-icon"></i>
                  <span>{loading ? "Wait..." : "Logout"}</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" id="login" className="poppins-regular">
                  <span>Login</span>
                </NavLink>
                <NavLink to="/register" id="register">
                  <span>Register</span>
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
