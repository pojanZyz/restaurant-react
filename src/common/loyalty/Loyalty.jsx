import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import useAuth from "../../js/useAuth";
import AccountPopup from "../../components/AccountPopup";
import Loader from "../../components/Loader";
import OrdersGrid from "./OrdersGrid.jsx";
import "./loyalty.css";
import ResGrid from "./ResGrid.jsx";
import DiscountTab from "./DiscountTab.jsx";

const Loyalty = () => {
  const { token, userData, tokenLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [reservations, setReservations] = useState([]);
  const [resCount, setResCount] = useState(0);
  const [resSearch, setResSearch] = useState("");
  const [resDebouncedSearch, setResDebouncedSearch] = useState("");
  const [resSort, setResSort] = useState("");
  const [resFilterDate, setResFilterDate] = useState("");

  const [discounts, setDiscounts] = useState([]);
  const [userDiscounts, setUserDiscounts] = useState([]);

  const [activeTab, setActiveTab] = useState("orders");
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  const navigate = useNavigate();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!token || tokenLoading) return;

    if (isFirstLoad.current) {
      fetchLoyalty();
      fetchOrders();
      fetchReservations();
      fetchDiscounts();
      isFirstLoad.current = false;
    } else {
      if (activeTab === "orders") {
        fetchOrders();
      } else if (activeTab === "reservations") {
        fetchReservations();
      } else if (activeTab === "discounts") {
        fetchDiscounts();
      }
    }
  }, [
    token,
    tokenLoading,
    activeTab,
    debouncedSearch,
    sort,
    filterDate,
    resDebouncedSearch,
    resSort,
    resFilterDate,
  ]);

  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);
  //get user orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/order-user?search=${debouncedSearch}&sort=${sort}&date=${filterDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data.data);
      setOrderCount(res.data.dataCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => setResDebouncedSearch(resSearch), 500);
    return () => clearTimeout(delay);
  }, [resSearch]);
  //get all reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/res-user?search=${resDebouncedSearch}&sort=${resSort}&date=${resFilterDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReservations(res.data.data);
      setResCount(res.data.dataCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //get all discounts
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`api/discount-sales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscounts(res.data.data);
      setUserDiscounts(res.data.userDiscounts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //get user loyalty
  const fetchLoyalty = async () => {
    setLoading(true);
    try {
      const res = await axios.get("api/user-loyalty", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.userData);
      setUsername(res.data.userData.username);
      setPhoneNumber(res.data.userData.phoneNumber);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //handle update data user
  const handleUpdateAcc = async (e) => {
    e.preventDefault();
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Are you sure?",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setLoading(true);
      try {
        const res = await axios.put(
          "api/user",
          { username, phoneNumber },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "info",
          title: "Information",
          text: res.data.message || "Update success",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/loyalty")
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
        });
        setUsername(user.username)
        setPhoneNumber(user.phoneNumber)
      } finally {
        setLoading(false);
      }
    }
  };

  // logout handler
  const handleLogout = async (e) => {
    e.preventDefault();
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Are you sure?",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setLoading(true);
      try {
        const res = await axios.delete("api/logout");
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
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {(loading || tokenLoading) && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="body-box">
        <div className="loyalty-container quicksand">
          <div className="loyalty-header">
            <h2 className="poppins-regular">
              <i className="bi bi-person-hearts"></i>
              <span> Loyalty </span>
            </h2>
          </div>
          <div className="loy-body1">
            <h4 className="poppins-regular">
              <i className="bi bi-person-fill-gear"></i>
              <span> Account Settings </span>
            </h4>
            <div className="acc-section">
              <form className="acc-form" onSubmit={handleUpdateAcc}>
                <label htmlFor="username">Username</label>
                <input
                  className="quicksand"
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                />
                <label htmlFor="username">Email</label>
                <input
                  className="quicksand"
                  type="text"
                  placeholder="Email"
                  required
                  value={user.useremail || ""}
                  readOnly
                  maxLength={20}
                />
                <label htmlFor="username">Phone Number</label>
                <input
                  className="quicksand"
                  type="text"
                  placeholder="Phone Number"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={20}
                />
                <div className="acc-bottom">
                  <button
                    className="save-btn poppins-regular"
                    type="submit"
                    onSubmit={handleUpdateAcc}
                    disabled={
                      (user.username === username &&
                        user.phoneNumber === phoneNumber) ||
                      !username ||
                      !phoneNumber
                    }
                  >
                    <i className="bi bi-check2-circle"></i>
                    <span> Save</span>
                  </button>
                  <button
                    className="logout-btn poppins-regular"
                    onClick={handleLogout}
                    type="button"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span> Logout</span>
                  </button>
                </div>
              </form>
              <div className="acc-data">
                <div className="total-spend">
                  <p>Total spend with CafeCoding</p>
                  <h3>
                    Rp
                    {(
                      orders.reduce((acc, order) => acc + order.fee, 0) +
                      reservations.length * 30000
                    ).toLocaleString("id-ID")}
                  </h3>
                </div>
                <div className="cc-point">
                  <p>Your CC Point</p>
                  <h3>
                    <i className="bi bi-coin"></i> {user.loyaltyCoins}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="loy-body2">
            <button
              className={`loy-tab-button poppins-regular ${
                activeTab === "orders" ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <i className="bi bi-calculator-fill"></i>
              <span> Orders </span>
              <span className="loy-count">{orderCount}</span>
            </button>
            <button
              className={`loy-tab-button poppins-regular ${
                activeTab === "reservations" ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab("reservations")}
            >
              <i className="bi bi-calendar-event-fill"></i>
              <span> Reservations </span>
              <span className="loy-count">{resCount}</span>
            </button>
            <button
              className={`loy-tab-button poppins-regular ${
                activeTab === "discounts" ? "active-tab" : ""
              }`}
              onClick={() => setActiveTab("discounts")}
            >
              <i className="bi bi-percent"></i>
              <span> Redeem </span>
              <span className="loy-count">{userDiscounts.length || 0}</span>
            </button>
          </div>
          <div className="loy-body3">
            {activeTab === "orders" ? (
              <OrdersGrid
                orders={orders}
                onFilterDate={setFilterDate}
                onSearch={setSearch}
                onSort={setSort}
              />
            ) : activeTab === "reservations" ? (
              <ResGrid
                reservations={reservations}
                onFilterDate={setResFilterDate}
                onSearch={setResSearch}
                onSort={setResSort}
              />
            ) : (
              <DiscountTab
                userCoins={user.loyaltyCoins}
                discounts={discounts}
                userDiscounts={userDiscounts}
                token={token}
              />
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
    </>
  );
};

export default Loyalty;
