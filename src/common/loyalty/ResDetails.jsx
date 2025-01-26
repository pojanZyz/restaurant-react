import React from "react";

const ResDetails = ({ isVisible, onClose, reservation }) => {
  if (!isVisible) return null;
  return (
    <div
      className={`update-con poppins-regular ${isVisible ? "ani-appear" : ""}`}
      onClick={onClose}
    >
      <div
        className="res-details-card quicksand"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header">
          <i className="bi bi-x-square-fill x-btn" onClick={onClose}></i>
          <span>Reservation Details</span>
        </div>
        <div className="card-content">
          <div className="content-1">
            <h3 className="poppins-regular">Reservation Status</h3>
            <hr />
            <div>
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
            </div>
          </div>
          <div className="content-2">
            <h3 className="poppins-regular">Reservation Details</h3>
            <hr />
            <div className="content-2-body">
              <div>
                <strong>
                  <i className="bi bi-calendar-fill"></i>{" "}
                </strong>
                {new Date(reservation.reservationDate).toLocaleDateString()}
              </div>
              <div>
                <strong>
                  <i className="bi bi-clock-fill"></i>
                </strong>{" "}
                {reservation.reservationTime}
              </div>
              <div>
                <i className="bi bi-grid-fill"></i>
                {"Table " +
                  reservation.tableInfo
                    .map((table) => table.tableNumber)
                    .join(", ")}
              </div>
            </div>

            <div className="res-notes">
              <strong>
                <i className="bi bi-pen"></i>
              </strong>{" "}
              {reservation.notes || "No notes included"}
            </div>
          </div>

          <div className="content-3">
            <div className="content-3-cus">
              <h3 className="poppins-regular">Customer Details</h3>
              <hr />
              <div>
                <strong>
                  <i className="bi bi-person-fill"></i>
                </strong>{" "}
                {reservation.userInfo.username}
              </div>
              <div>
                <strong>
                  <i className="bi bi-envelope-fill"></i>
                </strong>{" "}
                {reservation.userInfo.useremail}
              </div>
            </div>
            <div className="content-3-pay">
              <h3 className="poppins-regular">Payment Details</h3>
              <hr />
              <div>
                <strong>
                  <i className="bi bi-credit-card"></i>
                </strong>{" "}
                {reservation.paymentMethod || "-"}
              </div>
              <div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResDetails;
