import React, { useState, useEffect } from "react";
import axios from "axios";

import "../admin-css/admin-reserv.css";
import useAuth from "../js/useAuth";
import Loader from "../components/Loader";
import DetailsResPopup from "../components/DetailsResPopup";
import NoData from "../components/NoData";
import Swal from "sweetalert2";

const ReservationAdmin = () => {
  const { token, getToken, tokenLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [reservations, setReservations] = useState([]);
  const [reservationCount, setReservationCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [resStatus, setResStatus] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState({});

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (!tokenLoading && token) {
      fetchReservations();
    } else {
      setLoading(true);
    }
  }, [tokenLoading, token, debouncedSearch, sort, resStatus, page, limit]);

  //events handler
  const handleSearchChange = (searchVal) => {
    setSearch(searchVal);
    setPage(1);
  };
  const handleLimitChange = (limitVal) => {
    setLimit(limitVal);
    setPage(1);
  };
  const handleResStatus = (resStatusVal) => {
    setResStatus(resStatusVal);
    setPage(1);
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/reservation?search=${debouncedSearch}&sort=${sort}&page=${page}&limit=${limit}&reservationStatus=${resStatus}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReservations(res.data.data);
      setReservationCount(res.data.dataCount);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  //handle btn details
  const handleDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsPopup(!showDetailsPopup);
  };

  //handle update res
  const handleUpdateRes = async (
    resId,
    newReservationStatus,
    oldReservationStatus
  ) => {
    if (newReservationStatus === oldReservationStatus) {
      return Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Oops, you didn't make any changes",
      });
    }
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Update this reservation?",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setLoading(true);
      setShowDetailsPopup(false);
      try {
        const res = await axios.patch(`api/reservation/${resId}`, {
          reservationStatus: newReservationStatus,
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "Reservation updated",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchReservations();
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

  //handle delete res
  const handleDeleteRes = async (resId) => {
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Delete this reservation?",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setLoading(true);
      setShowDetailsPopup(false);
      try {
        const res = await axios.delete(`api/reservation/${resId}`);
        Swal.fire({
          icon: "info",
          title: "Information",
          text: res.data.message,
          showConfirmButton: false,
          timer: 2000,
        });
        fetchReservations();
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
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="reservation-admin-container quicksand">
        <div className="admin-reserv-con1">
          <h2 className="poppins-regular">
            <i className="bi bi-calendar-check"></i> Reservations
          </h2>
        </div>

        <div className="admin-reserv-con2">
          <div className="control-panel-admin">
            <div className="control-panel-main">
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
              <select
                className="quicksand"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Oldest</option>
                <option value="newest">Newest</option>
              </select>
              <select
                className="quicksand"
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="controlpanel-extend">
              <button
                className={
                  resStatus === ""
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => handleResStatus("")}
              >
                All
              </button>
              <button
                className={
                  resStatus === "Pending"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => handleResStatus("Pending")}
              >
                Pending
              </button>
              <button
                className={
                  resStatus === "Confirmed"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => handleResStatus("Confirmed")}
              >
                Confirmed
              </button>
              <button
                className={
                  resStatus === "Cancelled"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => handleResStatus("Cancelled")}
              >
                Cancelled
              </button>
            </div>
          </div>

          {reservationCount === 0 ? (
            <NoData str={"No reservation found"} />
          ) : (
            <>
              <div className="res-count-con">
                <div>
                  <span className="poppins-regular">
                    {reservationCount || 0}{" "}
                    <i className="bi bi-calendar-check"></i>
                  </span>
                  <span className="span-2">RESERVATIONS</span>
                </div>
                <div>
                  <i className="bi bi-columns"></i>
                  <span className="span-2">
                    Page {page} of {totalPages}
                  </span>
                </div>
              </div>

              <table className="reserv-table">
                <thead className="poppins-regular">
                  <tr>
                    <th>Customer Name</th>
                    <th>Reservation Date</th>
                    <th>RES-Status</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation._id}
                      onClick={() => handleDetails(reservation)}
                    >
                      <td>{reservation.userInfo.username}</td>
                      <td>
                        <div>
                          <i className="bi bi-calendar"></i>{" "}
                          {new Date(
                            reservation.reservationDate
                          ).toLocaleDateString()}
                        </div>
                        <div>
                          <i className="bi bi-clock"></i>{" "}
                          {reservation.reservationTime}
                        </div>
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
                        <button
                          className="poppins-regular"
                          onClick={() => handleDetails(reservation)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      </div>

      <DetailsResPopup
        onClose={() => setShowDetailsPopup(false)}
        isVisible={showDetailsPopup}
        reservation={selectedReservation}
        onUpdate={handleUpdateRes}
        onDelete={handleDeleteRes}
      />
    </div>
  );
};

export default ReservationAdmin;
