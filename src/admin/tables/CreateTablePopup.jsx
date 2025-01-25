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
      className={`update-con poppins-regular ${isVisible ? "ani-appear" : ""}`}
      onClick={onClose}
    >
      <div className="update-card" onClick={(e) => e.stopPropagation()}>
        <div className="card-header">
          <i className="bi bi-x-square-fill x-btn" onClick={onClose}></i>
          <span>Create Table</span>
        </div>
        <form className="table-form-update" onSubmit={handleCreate}>
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
        </form>
        <div className="table-card-footer">
          <button
            className="table-create-btn poppins-regular"
            onClick={handleCreate}
            type="submit"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTablePopup;
