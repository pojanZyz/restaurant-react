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
              <h4>NOW: </h4>
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
              <h4>Change to: </h4>
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
                {reservation.userInfo?.username ||
                  reservation.customerDetails?.name}
              </div>
              <div>
                <strong>
                  <i className="bi bi-envelope-fill"></i>
                </strong>{" "}
                {reservation.userInfo?.useremail || "-"}
              </div>
              <div>
                <i className="bi bi-telephone-fill"></i>{" "}
                {reservation.userInfo?.phoneNumber ||
                  reservation.customerDetails?.phoneNumber}
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
        <div className="res-card-footer">
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
