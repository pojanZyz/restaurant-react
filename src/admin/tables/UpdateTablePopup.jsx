import React, { useState, useEffect } from "react";

const UpdateTablePopup = ({
  isVisible,
  onClose,
  onUpdate,
  onDelete,
  table,
  selectedDate,
}) => {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Available");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (isVisible) {
      setTableNumber(table.tableNumber || "");
      setCapacity(table.capacity || "");
      setStatus(table.status || "Available");
      setDate(selectedDate || "");
    }
  }, [isVisible, table]);

  //handle update
  const handleUpdate = () => {
    const updatedTable = {
      _id: table._id,
      tableNumber,
      capacity,
      status,
      date,
    };
    onUpdate(updatedTable);
  };

  //handle delete
  const handleDelete = () => {
    const tableId = table._id;
    onDelete(tableId);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`common-con poppins-regular ${isVisible ? "ani-appear" : ""}`}
      onClick={onClose}
    >
      <div className="admin-popup" onClick={(e) => e.stopPropagation()}>
        <div className="ord-card-header">
          <i className="bi bi-x-square-fill x-btn" onClick={onClose}></i>
          <span>Table no: {table.tableNumber || 0}</span>
        </div>
        <div className="card-content">
          <div className="card-row3">
            <label htmlFor="tableNumber">Table Number</label>
            <input
              id="tableNumber"
              type="number"
              value={table.tableNumber}
              className="quicksand"
              required
              readOnly
            />
          </div>
          <div className="card-row3">
            <label htmlFor="capacity">Capacity</label>
            <input
              id="capacity"
              type="number"
              value={table.capacity}
              className="quicksand"
              required
              readOnly
            />
          </div>
          <div className="card-row1">
            <div>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="quicksand"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Occupied">Occupied</option>
              </select>
            </div>
            <div>
              <label className="date-label" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                className="quicksand table-cas-dateinp"
                required
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button className="delete-btn poppins-regular" onClick={handleDelete}>
            Delete
          </button>
          <button className="update-btn poppins-regular" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTablePopup;
