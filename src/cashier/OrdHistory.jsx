import React, { useState } from "react";

import "../admin-css/history.css";
import "../admin-css/ordercas.css";
import TableStat from "./TableStat";
import Revenue from "./Revenue";
import OrderTable from "./OrderTable";
import ResTable from "./ResTable";
import { Helmet } from "react-helmet";

const OrdHistory = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <>
    <Helmet>
      <title>CafeCoding | Cashier History</title>
    </Helmet>
    <div className="ordhis-container">
      <div className="ordhis-wrap">
        <h3 className="poppins-regular">
          <i className="bi bi-journal-text"></i> History
        </h3>
        <div className="history-con1">
          <Revenue />
          <TableStat />
        </div>

        <div className="history-tabs">
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
        </div>

        <div className="history-tab-content poppins-regular">
          {activeTab === "orders" ? <OrderTable /> : <ResTable />}
        </div>
      </div>
    </div>
    </>
  );
};

export default OrdHistory;
