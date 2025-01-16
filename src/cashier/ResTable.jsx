import React, { useState, useEffect } from "react";
import axios from "axios";

import useAuth from "../js/useAuth";
import NoData from "../components/NoData";
import OrderDetails from "../components/orderDetails";
import CashierLoader from "../components/CashierLoader";

const ResTable = () => {
  const { token, userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const [reservations, setReservations] = useState([]);
  const [resCount, setResCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [resType, setResType] = useState("");
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
    fetchReservations();
  }, [debouncedSearch, sort, filterDate, resType, paymentStatus, page, limit]);

  //get all res
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/reservation?search=${debouncedSearch}&sort=${sort}&page=${page}&limit=${limit}&paymentStatus=${paymentStatus}&date=${filterDate}&resType=${resType}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReservations(res.data.data);
      setResCount(res.data.dataCount);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="order-table-wrap quicksand">
        <div className="header">
          <div className="header-title">
            <h5 className="poppins-regular">Reservation Table</h5>
            <span>|</span>
            <div>
              <span className="poppins-regular">
                {resCount || 0}
                <i className="bi bi-cart-fill"></i>
              </span>
              <span style={{ fontSize: "70%" }}>RESERVATIONS</span>
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
            ) : resCount === 0 ? (
              <NoData str={"No reservation found"} />
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
                      <th>Res Status</th>
                      <th>Payment Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr
                        key={reservation._id}
                        className="quicksand"
                      >
                        <td>{reservation.resNumber}</td>
                        <td>
                          <span
                            className={`poppins-regular ${
                              reservation.resType === "cashier"
                                ? "order-type-cas"
                                : "order-type-onl"
                            }`}
                          >
                            {reservation.resType === "cashier" ? "CAS" : "ONL"}
                          </span>
                        </td>
                        <td
                          className={`${
                            reservation.userInfo?.username ? "" : "empty-lbl"
                          }`}
                        >
                          {reservation.userInfo?.username || "Empty"}
                        </td>
                        <td
                          className={`${
                            reservation.tableInfo
                              ? ""
                              : "empty-lbl"
                          }`}
                        >
                          {reservation.tableInfo
                            .map((table) => table.tableNumber)
                            .join(", ")}
                        </td>
                        <td>
                          <span
                            className={`${
                              reservation.reservationStatus === "Pending"
                                ? "res-pending"
                                : reservation.reservationStatus === "Confirmed"
                                ? "res-confirmed"
                                : "res-cancelled"
                            }`}
                          >
                            {reservation.reservationStatus}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${
                              reservation.paymentStatus === "Pending"
                                ? "res-pending"
                                : reservation.paymentStatus === "Paid"
                                ? "res-confirmed"
                                : "res-cancelled"
                            }`}
                          >
                            {reservation.paymentStatus}
                          </span>
                        </td>
                        <td>
                          {new Date(reservation.createdAt).toLocaleDateString(
                            "id-ID"
                          )}{" "}
                          -{" "}
                          {new Date(reservation.createdAt).toLocaleTimeString(
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
            <p className="poppins-regular">Res Type</p>
            <label className="quicksand">
              <input
                type="radio"
                name="resType"
                value="cashier"
                checked={resType === "cashier"}
                onChange={() => setResType("cashier")}
                onClick={() => setResType("")}
              />{" "}
              Cashier
            </label>
            <label className="quicksand">
              <input
                type="radio"
                name="resType"
                value="online"
                checked={resType === "online"}
                onChange={() => setResType("online")}
                onClick={() => setResType("")}
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
          </div>
        </div>
      </div>
      <OrderDetails
        isVisible={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default ResTable;
