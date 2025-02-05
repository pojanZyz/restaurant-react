import React, { useEffect, useState } from "react";

const DetailsResPopup = ({
  isVisible,
  onClose,
  onUpdate,
  onDelete,
  reservation,
}) => {
  const [reservationStatus, setReservationStatus] = useState("Pending");

  useEffect(() => {
    if (isVisible) {
      setReservationStatus(reservation.reservationStatus || "Pending");
    }
  }, [reservation, isVisible]);

  //handle update
  const handleUpdate = () => {
    onUpdate(reservation._id, reservationStatus, reservation.reservationStatus);
  };

  //handle delete
  const handleDelete = () => {
    onDelete(reservation._id);
  };

  if (!isVisible) return null;
  return (
    <div
      className={`common-con poppins-regular ${isVisible ? "ani-appear" : ""}`}
      onClick={onClose}
    >
      <div
        className="admin-popup quicksand"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ord-card-header">
          <i className="bi bi-x-square-fill x-btn" onClick={onClose}></i>
          <p className="poppins-regular">{reservation.resNumber}</p>
        </div>
        <div className="res-body1">
          <h5>Reservation Status</h5>
          <hr />
          <div>
            <p>NOW: </p>
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
          <div>
            <p>Change to:</p>
            <select
              className="quicksand"
              value={reservationStatus}
              onChange={(e) => setReservationStatus(e.target.value)}
            >
              <option value={"Pending"}>Pending</option>
              <option value={"Confirmed"}>Confirmed</option>
              <option value={"Cancelled"}>Cancelled</option>
            </select>
          </div>
        </div>
        <div className="res-body2">
          <h5>Reservation Details</h5>
          <hr />
          <div>
            <div>
              <strong>
                <i className="bi bi-calendar-fill"></i>{" "}
                {new Date(reservation.reservationDate).toLocaleDateString()}
              </strong>
            </div>
            <div>
              <strong>
                <i className="bi bi-clock-fill"></i>{" "}
                {reservation.reservationTime}
              </strong>
            </div>
          </div>
          <div>
            <span>
              <i className="bi bi-grid-fill"></i>{" "}
              {"Table " +
                reservation.tableInfo
                  .map((table) => table.tableNumber)
                  .join(", ")}
            </span>
          </div>
          <div className="res-notes">
            <span className={`${reservation.notes ? "" : "empty-lbl"}`}>
              <i className="bi bi-pen"></i>{" "}
              {reservation.notes || "No notes included"}
            </span>
          </div>
        </div>
        <div className="res-body3">
          <div>
            <h5 className="poppins-regular">Customer Details</h5>
            <hr />
            <span>
              <i className="bi bi-person-fill"></i>{" "}
              {reservation.userInfo?.username ||
                reservation.customerDetails?.name}
            </span>
            <span>
              <i className="bi bi-envelope-fill"></i>{" "}
              {reservation.userInfo?.useremail || "-"}
            </span>
            <span>
              <i className="bi bi-telephone-fill"></i>{" "}
              {reservation.userInfo?.phoneNumber ||
                reservation.customerDetails?.phoneNumber}
            </span>
          </div>
          <div>
            <h5 className="poppins-regular">Payment Details</h5>
            <hr />
            <span>
              <i className="bi bi-credit-card"></i>{" "}
              {reservation.paymentMethod || "-"}
            </span>
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
        <div className="card-footer">
          <button className="delete-btn poppins-regular" onClick={handleDelete}>
            Delete
          </button>
          <button className="update-btn poppins-regular" onClick={handleUpdate}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsResPopup;
