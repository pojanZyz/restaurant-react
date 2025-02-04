import React, { useState, useEffect } from "react";

import "../admin-css/history.css";

import axios from "axios";
import NoData from "../components/NoData";
import OrderDetails from "../components/OrderDetails";
import Loader from "../components/Loader";

const OrderTable = ({
  orders,
  onSearch,
  onSort,
  onFilterDate,
  onPaymentStatus,
  onLimit,
  onPage,
  page, 
  totalPages,
  filterDate
}) => {
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");

  //handle open details
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsPopup(!showDetailsPopup);
  };
  return (
    <>
      <div className="order-table-wrap quicksand">
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

        <div className="cas-filters">
          <div className="search-input">
            <i className="bi bi-search"></i>
            <input
              className="quicksand"
              type="search"
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search..."
            />
          </div>
          <div className="other-filt">
            <input
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => onFilterDate(e.target.value)}
              className="date-input"
            />
            <select
              className="quicksand"
              onChange={(e) => onSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="asc">A-Z</option>
              <option value="dsc">Z-A</option>
              <option value="oldest">Oldest</option>
            </select>
            <select
              className="quicksand pay-status"
              onChange={(e) => onPaymentStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              className="quicksand"
              onChange={(e) => onLimit(e.target.value)}
            >
              <option value="50">50</option>
              <option value="70">70</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        <table className="cashier-table">
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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <NoData str={"No order found"} />
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="quicksand"
                  onClick={() => handleOpenDetails(order)}
                >
                  <td style={{ fontWeight: "bold" }} className="td-code">
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
                      className={`td-username ${
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
                    {new Date(order.createdAt).toLocaleDateString("id-ID")} -{" "}
                    {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {orders.length === 0 ? (
          ""
        ) : (
          <div className="pagination">
            <button
              className="quicksand"
              disabled={page === 1}
              onClick={() => onPage(page - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pg) => (
                <button
                  key={pg}
                  className={`page-btn
                  ${
                    page === pg
                      ? "active-btn poppins-regular"
                      : "poppins-regular"
                  }`}
                  onClick={() => onPage(pg)}
                >
                  {pg}
                </button>
              )
            )}
            <button
              className="quicksand"
              disabled={page === totalPages}
              onClick={() => onPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
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
