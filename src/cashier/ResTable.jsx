import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../js/useAuth";
import NoData from "../components/NoData";
import Loader from "../components/Loader";
import ResDetailsCas from "../components/ResDetailsCas";

const ResTable = ({
  reservations,
  onSearch,
  onSort,
  onResStatus,
  onLimit,
  onPage,
  page,
  totalPages
}) => {
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState({});

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

  //handle btn details
  const handleDetails = (reservation) => {
    setSelectedReservation(reservation);
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
              className="quicksand"
              onChange={(e) => onResStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
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
              <th>Res-Status</th>
              <th>Payment Status</th>
              <th>Res-Date</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <NoData str={"No reservation found"} />
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr
                  key={reservation._id}
                  onClick={() => handleDetails(reservation)}
                >
                  <td style={{ fontWeight: "bold" }} className="td-code">
                    {reservation.resNumber}
                  </td>
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
                      reservation.userInfo?.username ||
                      reservation.customerDetails?.name
                        ? ""
                        : "empty-lbl"
                    }`}
                  >
                    {reservation.userInfo?.username ||
                      reservation.customerDetails?.name ||
                      "Empty"}
                  </td>
                  <td className={`${reservation.tableInfo ? "" : "empty-lbl"}`}>
                    {reservation.tableInfo
                      .map((table) => table.tableNumber)
                      .join(", ")}
                  </td>
                  <td className="td-resstat">
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
                  <td className="td-paystat">
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
                  <td className="td-resdate">
                    {new Date(reservation.reservationDate).toLocaleDateString(
                      "id-ID"
                    )}{" "}
                    - {reservation.reservationTime}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {reservations.length === 0 ? (
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
      <ResDetailsCas
        isVisible={showDetailsPopup}
        onClose={() => setShowDetailsPopup(false)}
        onUpdate={handleUpdateRes}
        reservation={selectedReservation}
      />
    </>
  );
};

export default ResTable;
