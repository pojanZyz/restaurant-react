import React, { useState, useEffect } from "react";

import "../admin-css/history.css";

import "../admin-css/ordercas.css";
import axios from "axios";
import CashierLoader from "../components/CashierLoader";
import NoData from "../components/NoData";
import OrderDetails from "../components/OrderDetails";

const OrderTable = () => {
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

  //get all orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/order?search=${debouncedSearch}&sort=${sort}&date=${filterDate}&orderType=${orderType}&paymentStatus=${paymentStatus}&page=${page}&limit=${limit}`
      );
      setOrders(res.data.data);
      setOrderCount(res.data.dataCount);
      setTotalPages(res.data.totalPages)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //handle reset filter
  const handleResetFilter = () => {
    setSearch("")
    setFilterDate("")
    setSort("")
    setLimit(50)
    setOrderType("")
    setPaymentStatus("")
  }

  //handle open details
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsPopup(!showDetailsPopup);
  };
  return (
    <>
      <div className="order-table-wrap quicksand">
        <div className="header">
          <div className="header-title">
            <h5 className="poppins-regular">Order Table</h5>
            <span>|</span>
            <div>
              <span className="poppins-regular">
                {orderCount || 0}
                <i className="bi bi-cart-fill"></i>
              </span>
              <span style={{ fontSize: "70%" }}>ORDERS</span>
            </div>
          </div>
          <div className="search-input">
            <i className="bi bi-search"></i>
            <input
              className="quicksand"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="body">
          <div className="left-body">
            {loading ? (
              <CashierLoader />
            ) : orderCount === 0 || orders.length === 0 ? (
              <NoData str={"No order found"} />
            ) : (
              <>
                <div className="table-box">
                  <table className="order-table">
                    <thead>
                      <tr className="poppins-regular">
                        <th>Code</th>
                        <th>Type</th>
                        <th>Cus Name</th>
                        <th>Table Number</th>
                        <th>Payment Status</th>
                        <th>Fee</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
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
                          <td
                            className={`${
                              order.userInfo?.username ? "" : "empty-lbl"
                            }`}
                          >
                            {order.userInfo?.username || "Empty"}
                          </td>
                          <td
                            className={`${
                              order.tableInfo?.tableNumber ? "" : "empty-lbl"
                            }`}
                          >
                            {order.tableInfo?.tableNumber || "Empty"}
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
                          <td className="cas-tgl">
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
                      ))}
                    </tbody>
                  </table>
                </div>
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
              </>
            )}
          </div>

          <div className="filters">
            <p className="poppins-regular">Date</p>
            <input
              type="date"
              value={filterDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setFilterDate(e.target.value)}
              className="date-input"
            />
            <p className="poppins-regular">Sort</p>
            <select
              className="quicksand"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="asc">A-Z</option>
              <option value="dsc">Z-A</option>
              <option value="oldest">Oldest</option>
            </select>
            <p className="poppins-regular">Limit</p>
            <select
              className="quicksand"
              onChange={(e) => setLimit(e.target.value)}
            >
              <option value="50">50</option>
              <option value="70">70</option>
              <option value="100">100</option>
            </select>
            <p className="poppins-regular">Order Type</p>
            <label className="quicksand">
              <input
                type="radio"
                name="orderType"
                value="cashier"
                checked={orderType === "cashier"}
                onChange={() => setOrderType("cashier")}
                onClick={() => setOrderType("")}
              />{" "}
              Cashier
            </label>
            <label className="quicksand">
              <input
                type="radio"
                name="orderType"
                value="online"
                checked={orderType === "online"}
                onChange={() => setOrderType("online")}
                onClick={() => setOrderType("")}
              />{" "}
              Online
            </label>
            <p className="poppins-regular">Payment Status</p>
            <label className="quicksand">
              <input
                type="radio"
                name="paymentStatus"
                value="Pending"
                checked={paymentStatus === "Pending"}
                onChange={() => setPaymentStatus("Pending")}
                onClick={() => setPaymentStatus("")}
              />{" "}
              Pending
            </label>
            <label className="quicksand">
              <input
                type="radio"
                name="paymentStatus"
                value="Paid"
                checked={paymentStatus === "Paid"}
                onChange={() => setPaymentStatus("Paid")}
                onClick={() => setPaymentStatus("")}
              />{" "}
              Paid
            </label>
            <label className="quicksand">
              <input
                type="radio"
                name="paymentStatus"
                value="Cancelled"
                checked={paymentStatus === "Cancelled"}
                onChange={() => setPaymentStatus("Cancelled")}
                onClick={() => setPaymentStatus("")}
              />{" "}
              Cancelled
            </label>
            <button
              className="reset-fil-btn poppins-regular"
              onClick={handleResetFilter}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      <OrderDetails
        isVisible={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
        order={selectedOrder}
        from={"cashier"}
      />
    </>
  );
};

export default OrderTable;
