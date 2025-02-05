import React, { useState, useEffect } from "react";

const CreateTablePopup = ({ isVisible, onClose, onCreate }) => {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    if (isVisible) {
      setTableNumber("");
      setCapacity("");
    }
  }, [isVisible]);

  //handle create
  const handleCreate = () => {
    const newTable = {
      tableNumber,
      capacity,
    };
    onCreate(newTable);
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
          <span>Create Table</span>
        </div>
        <div className="card-content">
          <div className="card-row3">
            <label htmlFor="tableNumber">Table Number</label>
            <input
              id="tableNumber"
              type="number"
              value={tableNumber}
              className="quicksand"
              required
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
          <div className="card-row3">
            <label htmlFor="capacity">Capacity</label>
            <input
              id="capacity"
              type="number"
              value={capacity}
              className="quicksand"
              required
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
        </div>
        <div className="card-footer">
          <button className="create-btn poppins-regular" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTablePopup;
