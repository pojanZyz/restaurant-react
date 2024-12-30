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
    const tableId = table._id
    onDelete(tableId)
  }

  if (!isVisible) return null;

  return (
    <div
      className={`update-con poppins-regular ${isVisible ? "ani-appear" : ""}`}
      onClick={onClose}
    >
      <div className="update-card" onClick={(e) => e.stopPropagation()}>
        <div className="card-header">
          <i className="bi bi-x-square-fill x-btn" onClick={onClose}></i>
          <span>Table no: {tableNumber || 0}</span>
        </div>
        <form className="table-form-update" onSubmit={handleUpdate}>
          <label htmlFor="tableNumber">Table Number</label>
          <input
            id="tableNumber"
            type="number"
            value={tableNumber}
            className="quicksand"
            onChange={(e) => setTableNumber(e.target.value)}
            required
          />
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            type="number"
            value={capacity}
            className="quicksand"
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
          <div className="stat-date">
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
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                className="quicksand"
                required
                readOnly
              />
            </div>
          </div>
        </form>
        <div className="table-card-footer">
          <button className="table-delete-btn poppins-regular" onClick={handleDelete}>Delete</button>
          <button className="table-update-btn poppins-regular" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTablePopup;
