import React, {useState, useEffect} from "react";

const TablePopupCas = ({ isVisible, onClose, onUpdate, table, selectedDate }) => {
  const [status, setStatus] = useState("Available");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (isVisible) {
      setStatus(table.status || "Available");
      setDate(selectedDate || "");
    }
  }, [isVisible, table]);

  //handle update
  const handleUpdate = () => {
    const updatedTable = {
      _id: table._id,
      status,
      date,
    };
    onUpdate(updatedTable);
  };
  if (!isVisible) return null;

  return (
    <div
      className={`order-details-con poppins-regular ${
        isVisible ? "ani-appear" : ""
      }`}
      onClick={onClose}
    >
      <div className="update-card" onClick={(e) => e.stopPropagation()}>
        <div className="card-header">
          <i className="bi bi-x-square-fill x-btn" onClick={onClose}></i>
          <span>Table no: {table.tableNumber || 0}</span>
        </div>
        <form className="table-form-update" onSubmit={handleUpdate}>
          <label htmlFor="tableNumber">Table Number</label>
          <input
            id="tableNumber"
            type="number"
            value={table.tableNumber}
            className="quicksand"
            required
            readOnly
          />
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            type="number"
            value={table.capacity}
            className="quicksand"
            required
            readOnly
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
              <label className="date-label" htmlFor="date">
                Date
              </label>
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
          <button
            className="table-update-btn poppins-regular"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablePopupCas;
