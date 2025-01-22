import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import useAuth from "../../js/useAuth";
import AccountPopup from "../../components/AccountPopup";
import Loader from "../../components/Loader";
import OrdersGrid from "./OrdersGrid.jsx"
import "./loyalty.css";
import ResGrid from "./ResGrid.jsx";

const Loyalty = () => {
  const { token, userData, tokenLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});
  const [orderCount, setOrderCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);

  const [activeTab, setActiveTab] = useState("orders");
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchLoyalty();
  }, [token, tokenLoading]);

  //get user loyalty
  const fetchLoyalty = async () => {
    setLoading(true);
    try {
      const res = await axios.get("api/user-loyalty", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.userData);
      setOrderCount(res.data.ordCount)
      setReservationCount(res.data.resCount)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="body-box">
      <div className="loyalty-container quicksand">
        <div className="loyalty-header">
          <h2 className="poppins-regular">
            <i className="bi bi-person-hearts"></i> Loyalty
          </h2>
          <button
            className="user-profile poppins-regular"
            onClick={() => setShowAccountPopup(!showAccountPopup)}
          >
            <span>{userData?.useremail || "Loading.."}</span>
            <i className="bi bi-person-circle"></i>
          </button>
        </div>
        <div className="loy-body1">
          <div className="card-loy1">
            <i className="bi bi-credit-card"></i>
            <div>
              <p>CC Points</p>
              <h3 className="poppins-regular">{user.loyaltyCoins || 0}</h3>
            </div>
          </div>
          <div
            className="card-loy1"
            onClick={() => setActiveTab("reservations")}
          >
            <i className="bi bi-calendar2-check"></i>
            <div>
              <p>Reservations</p>
              <h3 className="poppins-regular">{reservationCount || 0}</h3>
            </div>
          </div>
          <div className="card-loy1" onClick={() => setActiveTab("orders")}>
            <i className="bi bi-cart-check"></i>
            <div>
              <p>Orders</p>
              <h3 className="poppins-regular">{orderCount || 0}</h3>
            </div>
          </div>
        </div>
        <div className="loy-body2">
          <button
            className={`tab-button poppins-regular ${
              activeTab === "orders" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <i className="bi bi-calculator-fill"></i> Orders
          </button>
          <button
            className={`tab-button poppins-regular ${
              activeTab === "reservations" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("reservations")}
          >
            <i className="bi bi-calendar-event-fill"></i> Reservations
          </button>
          <button
            className={`tab-button poppins-regular ${
              activeTab === "discounts" ? "active-tab" : ""
            }`}
            onClick={() => setActiveTab("discounts")}
          >
            <i className="bi bi-percent"></i> Discounts
          </button>
        </div>
        <div className="loy-body3">
          {activeTab === "orders" ? (
            <OrdersGrid />
          ) : activeTab === "reservations" ? (
            <ResGrid />
          ) : (
            ""
          )}
        </div>
      </div>
      <AccountPopup
        isVisible={showAccountPopup}
        onClose={() => setShowAccountPopup(!showAccountPopup)}
        onLogout={handleLogout}
        profile={userData}
        from={"loyalty"}
      />
    </div>
  );
};

export default Loyalty;
