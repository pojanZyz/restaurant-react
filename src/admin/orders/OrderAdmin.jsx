import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Swal from "sweetalert2";

import Loader from "../../components/Loader";
import NoData from "../../components/NoData";
import "./admin-order.css";
import OrderStat from "./OrderStat";
import OrderDetails from "../../components/OrderDetails";
import useAuth from "../../js/useAuth";

const OrderAdmin = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [orderType, setOrderType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(50);

  const [revenue, setRevenue] = useState([]);
  const [bestOrders, setBestOrders] = useState([]);

  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");

  //debounces
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    fetchOrders();
  }, [
    debouncedSearch,
    sort,
    filterDate,
    orderType,
    paymentStatus,
    page,
    limit,
  ]);
  useEffect(() => {
    fetchOrderStats();
  }, [orders]);

  //events handler
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

  //handle open details
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsPopup(!showDetailsPopup);
  };

  //get all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/order?search=${debouncedSearch}&sort=${sort}&date=${filterDate}&orderType=${orderType}&paymentStatus=${paymentStatus}&page=${page}&limit=${limit}`
      );
      setOrders(res.data.data);
      setOrderCount(res.data.dataCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //get order stats
  const fetchOrderStats = async () => {
    try {
      const res = await axios.get("api/order-stats");
      setRevenue(res.data.revenue);
      setBestOrders(res.data.topOrders);
    } catch (error) {
      console.error(error);
    }
  };

  //delete order
  const handleDeleteOrder = async (orderId) => {
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Delete this order? This will make the record gone forever",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (confirmation.isConfirmed) {
      try {
        setLoading(true);
        setShowDetailsPopup(false);
        const res = await axios.delete(`api/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "Order deleted",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchOrders();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <>
      <Helmet>
        <title>CafeCoding | Admin-Orders</title>
      </Helmet>
      <div className="body-box">
        {loading && (
          <div className="loader-overlay">
            <Loader />
          </div>
        )}
        <div className="admin-menu-container quicksand">
          <div className="admin-menu-con1">
            <h2 className="poppins-regular">
              <i className="bi bi-bag-check-fill"></i>{" "}
              <span className="judul">Orders</span>
            </h2>
          </div>

          <div className="admin-menu-con2">
            <OrderStat
              revenue={revenue}
              bestOrders={bestOrders}
              orderCount={orderCount}
            />
          </div>

          <div className="admin-menu-con3">
            <div className="table-det">
              <div className="page-ttl">
                <i className="bi bi-columns"></i>
                <span className="span-2">
                  Page {page} of {totalPages}
                </span>
              </div>
              <div className="page-ttl">
                <i className="bi bi-hand-index-thumb"></i>
                <span>Click each items to see details.</span>
              </div>
            </div>

            <div className="filters">
              <div className="search-input">
                <i className="bi bi-search"></i>
                <input
                  className="quicksand"
                  type="search"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search..."
                />
              </div>
              <input
                type="date"
                value={filterDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFilterDate(e.target.value)}
                className="date-input"
              />
              <select
                className="quicksand"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="asc">A-Z</option>
                <option value="dsc">Z-A</option>
                <option value="oldest">Oldest</option>
              </select>
              <select
                className="quicksand pay-status"
                onChange={(e) => handlePayStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select
                className="quicksand"
                onChange={(e) => handleLimitChange(e.target.value)}
              >
                <option value="50">50</option>
                <option value="70">70</option>
                <option value="100">100</option>
              </select>
            </div>

            <div className="users-wrap">
              <table className="user-table">
                <thead className="poppins-regular">
                  <tr>
                    <th>Code</th>
                    <th>Type</th>
                    <th>Cus-Name</th>
                    <th>No. Table</th>
                    <th>Payment Status</th>
                    <th>Fee</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {orderCount === 0 || orders.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <NoData str={"No reservation found"} />
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order._id}
                        className="quicksand"
                        onClick={() => handleOpenDetails(order)}
                      >
                        <td style={{ fontWeight: "bold" }}>
                          {order.orderNumber}
                        </td>
                        <td>
                          <span
                            className={`poppins-regular ${
                              order.orderType === "cashier"
                                ? "order-type-cas"
                                : "order-type-onl"
                            }`}
                          >
                            {order.orderType === "cashier" ? "CAS" : "ONL"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${
                              order.userInfo?.username ? "" : "empty-lbl"
                            }`}
                          >
                            {order.userInfo?.username || "Empty"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${
                              order.tableInfo?.tableNumber ? "" : "empty-lbl"
                            }`}
                          >
                            {order.tableInfo?.tableNumber || "Empty"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${
                              order.paymentStatus === "Pending"
                                ? "res-pending"
                                : order.paymentStatus === "Paid"
                                ? "res-confirmed"
                                : "res-cancelled"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td style={{ color: "#048727", fontWeight: "800" }}>
                          Rp. {order.fee.toLocaleString("id-ID")}
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID"
                          )}{" "}
                          -{" "}
                          {new Date(order.createdAt).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {orderCount === 0 ? (
                ""
              ) : (
                <div className="pagination">
                  <button
                    className="quicksand"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((pg) => (
                    <button
                      key={pg}
                      className={`page-btn
                  ${
                    page === pg
                      ? "active-btn poppins-regular"
                      : "poppins-regular"
                  }`}
                      onClick={() => setPage(pg)}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    className="quicksand"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <OrderDetails
          isVisible={showDetailsPopup}
          onClose={() => setShowDetailsPopup(!showDetailsPopup)}
          order={selectedOrder}
          from={"admin"}
          onDelete={handleDeleteOrder}
        />
      </div>
    </>
  );
};

export default OrderAdmin;
