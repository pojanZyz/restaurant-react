import React, { useState, useEffect } from "react";

const UpdateDiscPopup = ({ isVisible, onClose, onUpdate, onDelete, discount }) => {
  const [discountCode, setDiscountCode] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [costInCoins, setCostInCoins] = useState("");

  useEffect(() => {
    if (isVisible) {
      setCostInCoins(discount.costInCoins || "");
      setDiscountCode(discount.discountCode || "");
      setDiscountType(discount.discountType || "fixed");
      setDiscountValue(discount.discountValue || "");
      setExpiryDate(discount.expiryDate.split("T")[0] || "");
    }
  }, [isVisible]);

  //handle update
  const handleUpdate = () => {
    const updatedDisc = {
      _id: discount._id,
      discountCode,
      discountType,
      discountValue: parseInt(discountValue),
      expiryDate,
      costInCoins: parseInt(costInCoins),
    };
    onUpdate(updatedDisc);
  };

  //handle delete
  const handleDelete = () => {
    onDelete(discount._id)
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
          <span>{discount.discountCode}</span>
        </div>
        <form className="createdsc-form" onSubmit={handleUpdate}>
          <label htmlFor="discCode">Discount Code</label>
          <input
            type="text"
            className="quicksand"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            required
            maxLength={10}
          />
          <div className="type-val">
            <div>
              <label htmlFor="discValue">Discount Value</label>
              <label className="quicksand">
                <span className="lbl-type">
                  {discountType === "fixed" ? "Rp." : "%"}
                </span>
                <input
                  type="number"
                  className="quicksand"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                  maxLength={12}
                />
              </label>
            </div>
            <div>
              <label htmlFor="discType">Discount Type</label>
              <select
                className="quicksand"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
          </div>
          <label htmlFor="expDate">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="quicksand"
            required
          />
          <label htmlFor="expDate">CCPoints Cost</label>
          <input
            type="number"
            value={costInCoins}
            onChange={(e) => setCostInCoins(e.target.value)}
            className="quicksand"
            required
          />
        </form>
        <div className="table-card-footer">
          <button
            className="table-delete-btn poppins-regular"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="table-update-btn poppins-regular"
            onClick={handleUpdate}
            type="submit"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDiscPopup;
