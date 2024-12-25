import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../css/app.css";
import logo from "../img/logo_restoran.png";
import axios from "axios";

const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({
    userId: "",
    username: "",
    useremail: "",
    role: "",
  });

  //check token
  useEffect(() => {
    getToken();
  }, []);
  const getToken = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://cafemdn-api.vercel.app/api/token");
      console.log(res.data);
      const decoded = jwtDecode(res.data.accessToken);
      setUserData({
        userId: decoded.userId,
        username: decoded.username,
        useremail: decoded.useremail,
        role: decoded.role,
      });

      setToken(res.data.accessToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //logout handler
  const handleLogout = () => {
    setLoading(true);
    axios
      .delete("https://cafemdn-api.vercel.app/api/logout")
      .then((res) => {
        alert(res.data.message);
        setMessage(res.data.message);
      })
      .catch((err) => {
        alert(err.response.data.message);
        setMessage(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
        window.location.reload();
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
              <NavLink to="/pemesanan">
                <i className="bi bi-bag-check-fill"></i>
                <span>Shopping</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/payment">
                <i className="bi bi-calculator"></i>
                <span>Payment</span>
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
        <div className="auth-con poppins-regular">
          {token ? (
            <>
            <span className="username quicksand">Welcome back, {userData.username}!</span>
            <button className="logout-btn poppins-regular" onClick={handleLogout}>
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
      </div>
    </aside>
  );
};

export default Sidebar;
