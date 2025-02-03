import React, { useState, useEffect } from "react";

import "../admin-css/history.css";
import TableStat from "./TableStat";
import OrderTable from "./OrderTable";
import ResTable from "./ResTable";
import { Helmet } from "react-helmet";
import axios from "axios";
import Revenue from "./Revenue"

const OrdHistory = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orderCount, setOrderCount] = useState(0);
  const [resCount, setResCount] = useState(0);
  const [revenueData, setRevenueData] = useState({
    total: 0,
    orders: 0,
    reservations: 0,
  });

  useEffect(() => {
    fetchRevenue();
  }, []);

  //get today revenue
  const fetchRevenue = async () => {
    try {
      const response = await axios.get("api/daily-revenue");
      setRevenueData(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch revenue data",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>CafeCoding | Cashier History</title>
      </Helmet>
      <div className="history-container quicksand">
        <h3 className="poppins-regular header-title">
          <i className="bi bi-journal-text"></i> History
        </h3>
        <div className="history-main">
          <div className="history-secondary">
            <TableStat />
          </div>
          <div className="history-main-content">
            <div className="tab-buttons">
              <button
                className={`loy-tab-button poppins-regular ${
                  activeTab === "orders" ? "active-tab" : ""
                }`}
                onClick={() => setActiveTab("orders")}
              >
                <i className="bi bi-calculator-fill"></i>
                <span> Orders </span>
              </button>
              <button
                className={`loy-tab-button poppins-regular ${
                  activeTab === "reservations" ? "active-tab" : ""
                }`}
                onClick={() => setActiveTab("reservations")}
              >
                <i className="bi bi-calendar-event-fill"></i>
                <span> Reservations </span>
              </button>
            </div>
            {activeTab === "orders" ? (
              <OrderTable/>
            ) : (
              <ResTable/>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdHistory;
