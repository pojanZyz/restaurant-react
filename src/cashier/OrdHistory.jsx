import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

import "../admin-css/history.css";
import TableStat from "./TableStat";
import OrderTable from "./OrderTable";
import ResTable from "./ResTable";
import Loader from "../components/Loader";
import useAuth from "../js/useAuth";

const OrdHistory = () => {
  const { token, tokenLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(50);

  const [reservations, setReservations] = useState([]);
  const [resCount, setResCount] = useState(0);
  const [resPage, setResPage] = useState(1);
  const [resTotalPages, setResTotalPages] = useState(1);
  const [resLimit, setResLimit] = useState(10);
  const [resStatus, setResStatus] = useState("");
  const [resSort, setResSort] = useState("");
  const [resSearch, setResSearch] = useState("");
  const [resDebouncedSearch, setResDebouncedSearch] = useState("");

  const isFirstLoad = useRef(true);

  //load datas
  useEffect(() => {
    if (!token || tokenLoading) return;

    if (isFirstLoad.current) {
      fetchOrders();
      fetchReservations();
      isFirstLoad.current = false;
    } else {
      if (activeTab === "orders") {
        fetchOrders();
      } else if (activeTab === "reservations") {
        fetchReservations();
      }
    }
  }, [
    token,
    tokenLoading,
    activeTab,
    debouncedSearch,
    sort,
    limit,
    page,
    filterDate,
    paymentStatus,
    resStatus,
    resLimit,
    resDebouncedSearch,
    resSort,
    resPage,
  ]);

  //debounces
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    const delay = setTimeout(() => setResDebouncedSearch(resSearch), 500);
    return () => clearTimeout(delay);
  }, [resSearch]);

  //events handler (ord)
  const handleSearchChange = (searchVal) => {
    setSearch(searchVal);
    setPage(1);
  };
  const handleLimitChange = (limitVal) => {
    setLimit(limitVal);
    setPage(1);
  };
  const handlePayStatus = (payStatusVal) => {
    setPaymentStatus(payStatusVal);
    setPage(1);
  };
  //events handler (cas)
  const handleResSearchChange = (searchVal) => {
    setResSearch(searchVal);
    setPage(1);
  };
  const handleResLimitChange = (limitVal) => {
    setResLimit(limitVal);
    setPage(1);
  };
  const handleResStatus = (resStatusVal) => {
    setResStatus(resStatusVal);
    setPage(1);
  };
  
  //get all orders
  const fetchOrders = async () => {
    setLoading(true);

    console.log("Fetching orders with:", {
      search: debouncedSearch,
      sort,
      date: filterDate,
      paymentStatus,
      page,
      limit,
    });

    try {
      const res = await axios.get(
        `api/order?search=${debouncedSearch}&sort=${sort}&date=${filterDate}&paymentStatus=${paymentStatus}&page=${page}&limit=${limit}`
      );
      setOrders(res.data.data);
      setOrderCount(res.data.dataCount);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  //get all res
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/reservation?search=${resDebouncedSearch}&sort=${resSort}&page=${resPage}&limit=${resLimit}&reservationStatus=${resStatus}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReservations(res.data.data);
      setResCount(res.data.dataCount);
      setResTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>CafeCoding | Cashier History</title>
      </Helmet>
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="history-container quicksand">
        <h3 className="poppins-regular header-title">
          <i className="bi bi-journal-text"></i> History
        </h3>
        <div className="history-main">
          <div className="history-secondary">
            <div className="history-data">
              <div className="card-1">
                <p>Orders</p>
                <h3>
                  <i className="bi bi-calculator-fill"></i>
                  {orderCount || 0}
                </h3>
              </div>
              <div className="card-1">
                <p>Reservations</p>
                <h3>
                  <i className="bi bi-calendar2-check-fill"></i> {resCount || 0}
                </h3>
              </div>
            </div>
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
              <OrderTable
                orders={orders}
                onSearch={handleSearchChange}
                onSort={setSort}
                onLimit={handleLimitChange}
                onFilterDate={setFilterDate}
                onPaymentStatus={handlePayStatus}
                onPage={setPage}
                page={page}
                totalPages={totalPages}
                filterDate={filterDate}
              />
            ) : (
              <ResTable
                reservations={reservations}
                onSearch={handleResSearchChange}
                onLimit={handleResLimitChange}
                onSort={setResSort}
                onResStatus={handleResStatus}
                onPage={setPage}
                page={resPage}
                totalPages={totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdHistory;
