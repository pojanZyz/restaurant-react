import React, { useState, useEffect } from "react";

const CreateDiscPopup = ({ isVisible, onClose, onCreate }) => {
  const [discountCode, setDiscountCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [costInCoins, setCostInCoins] = useState("");

  useEffect(() => {
    if (isVisible) {
      setCostInCoins("");
      setDiscountCode("");
      setDiscountType("percentage");
      setDiscountValue("");
      setExpiryDate("");
    }
  }, [isVisible]);

  //handle create
  const handleCreate = () => {
    const newTable = {
      discountCode,
      discountType,
      discountValue: parseInt(discountValue),
      expiryDate,
      costInCoins: parseInt(costInCoins),
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
          <span>Create Discount</span>
        </div>
        <form className="createdsc-form" onSubmit={handleCreate}>
          <div className="disc-code">
            <label htmlFor="discCode">Discount Code</label>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              required
              maxLength={10}
            />
          </div>
          <div className="type-val">
            <div>
              <label htmlFor="discValue">Discount Value</label>
              <label className="quicksand">
                <span className="lbl-type">
                  {discountType === "fixed" ? "Rp." : "%"}
                </span>
                <input
                  type="number"
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
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
          </div>
          <div className="disc-code">
            <label htmlFor="expDate">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="quicksand"
              required
            />
          </div>
          <div className="disc-code">
            <label htmlFor="expDate">CCPoints Cost</label>
            <input
              type="number"
              value={costInCoins}
              onChange={(e) => setCostInCoins(e.target.value)}
              className="quicksand"
              required
            />
          </div>
        </form>
        <div className="card-footer">
          <button
            className="create-btn poppins-regular"
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

export default CreateDiscPopup;
