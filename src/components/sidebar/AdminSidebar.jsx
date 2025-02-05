import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../../js/useAuth";
import logo from "../../img/logo_restoran.png";

const AdminSidebar = () => {
  const sidebarRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { token, userData, getToken, tokenLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const handleClickOutside = (event) => {
        const sidebar = document.getElementById("admin-sidebar");
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
    <>
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}
      <aside
        id="admin-sidebar"
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
            <NavLink to="/admin" end onClick={() => setIsOpen(false)}>
              <i className="bi bi-bar-chart-line-fill"></i> <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/menu" onClick={() => setIsOpen(false)}>
              <i className="bi bi-cart-fill"></i> <span>Products</span>
            </NavLink>

            <NavLink to="/admin/user" onClick={() => setIsOpen(false)}>
              <i className="bi bi-person-fill"></i> <span>Users</span>
            </NavLink>

            <NavLink to="/admin/order" onClick={() => setIsOpen(false)}>
              <i className="bi bi-bag-check-fill"></i> <span>Orders</span>
            </NavLink>

            <NavLink to="/admin/discount" onClick={() => setIsOpen(false)}>
              <i className="bi bi-percent"></i> <span>Discounts</span>
            </NavLink>

            <NavLink to="/admin/table" onClick={() => setIsOpen(false)}>
              <i className="bi bi-table"></i> <span>Tables</span>
            </NavLink>

            <NavLink to="/admin/reservation" onClick={() => setIsOpen(false)}>
              <i className="bi bi-calendar-check"></i> <span>Reservations</span>
            </NavLink>

            <NavLink to="/admin/comment" onClick={() => setIsOpen(false)}>
              <i className="bi bi-chat-left-dots-fill"></i>{" "}
              <span>Comments</span>
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

      {/*top bar for tablet/hp */}
      <nav className="top-bar" style={{ background: "#2c3e50" }}>
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

export default AdminSidebar;
