import React, { useState, useEffect } from "react";
import axios from "axios";

import useAuth from "../../js/useAuth";
import Loader from "../../components/Loader";
import NoData from "../../components/NoData";
import ResDetails from "./ResDetails";

const ResGrid = () => {
  const { token, tokenLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [reservations, setReservations] = useState([]);
  const [resCount, setResCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [selectedRes, setSelectedRes] = useState({});
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    if (!token || tokenLoading) {
      return;
    }
    fetchReservations();
  }, [token, tokenLoading, debouncedSearch, sort, filterDate]);

  //get all reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/res-user?search=${debouncedSearch}&sort=${sort}&date=${filterDate}`,
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

  const calculateDaysToGo = (reservation) => {
    if (reservation.paymentStatus === "Cancelled") {
      return "";
    }
    const today = new Date();
    const targetDate = new Date(reservation.reservationDate);
    const timeDiff = targetDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff > 0) {
      return `${daysDiff} days to go`;
    } else if (daysDiff === 0) {
      return "Today is the day!";
    } else {
      return "";
    }
  };

  //handle open details
  const handleOpenDetails = (reservation) => {
    setSelectedRes(reservation);
    setShowDetailsPopup(!showDetailsPopup);
  };

  return (
    <>
      {(loading || tokenLoading) && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="filters">
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
        <input
          type="date"
          value={filterDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFilterDate(e.target.value)}
          className="date-input"
        />
        <select className="quicksand" onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="orders-grid">
        {reservations.length === 0 || resCount === 0 ? (
          <NoData str={"No order found"} />
        ) : (
          reservations.map((reservation) => (
            <div
              className="order-item-grid"
              key={reservation._id}
              onClick={() => handleOpenDetails(reservation)}
            >
              <div className="item-header">
                <div>
                  <p className="ord-num poppins-regular">
                    {reservation.resNumber}
                  </p>
                  <p className="ord-num">
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
                  </p>
                </div>
                <span
                  className={`${
                    reservation.paymentStatus === "Pending"
                      ? "res-pending"
                      : reservation.paymentStatus === "Paid"
                      ? "res-confirmed"
                      : "res-cancelled"
                  }`}
                >
                  <i className="bi bi-credit-card"></i>{" "}
                  {reservation.paymentStatus}
                </span>
              </div>
              <ul className="product-list">
                <li>
                  <i className="bi bi-calendar-fill"></i>{" "}
                  {new Date(reservation.reservationDate).toLocaleDateString(
                    "id-ID"
                  )}
                </li>
                <li>
                  <i class="bi bi-clock-fill"></i> {reservation.reservationTime}
                </li>
                <li>
                  <i className="bi bi-grid-fill"></i>
                  {"Table " +
                    reservation.tableInfo
                      .map((table) => table.tableNumber)
                      .join(", ")}
                </li>
              </ul>
              <div className="item-footer">
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
                <p className="day-details">{calculateDaysToGo(reservation)}</p>
              </div>
            </div>
          ))
        )}
        <ResDetails
          isVisible={showDetailsPopup}
          onClose={() => setShowDetailsPopup(false)}
          reservation={selectedRes}
        />
      </div>
    </>
  );
};

export default ResGrid;
