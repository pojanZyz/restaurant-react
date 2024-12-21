import React, {useState} from "react";
import { NavLink } from "react-router-dom";
import "../css/app.css";
import logo from "../img/logo_restoran.png"

const Sidebar = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const handleLogout = () => {
    setLoading(true)
    axios
    .delete('https://cafemdn-api.vercel.app/api/logout')
    .then((res) => {
      alert(res.data.message)
      setMessage(res.data.message)
    })
    .catch((err) => {
      alert(err.response.data.message)
      setMessage(err.response.data.message)
    })
    .finally(() => {
      setLoading(false)
    })
  }
  return (
    <aside id="sidebar">
      <div className="container-sidebar">
        <div className="side-head">
          <img src={logo} alt="logo-resto" />
          <h1>Restorant</h1>
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
        <div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right logout-icon"></i>
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar