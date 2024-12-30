import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../admin-css/admin-menu.css";

const CreatePopup = ({ isVisible, onClose, onCreate }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("food");
  const [productPrice, setProductPrice] = useState("");
  const [productImagePath, setProductImagePath] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setProductName("");
      setProductDescription("");
      setProductCategory("food");
      setIsAvailable(false);
      setProductPrice("");
      setProductImagePath(null);
    }
  }, [isVisible]);

  const handleCreate = () => {
    const newProduct = {
      image: productImagePath,
      productName,
      productPrice,
      productDescription,
      isAvailable,
      productCategory,
    };
    onCreate(newProduct);
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
          <span>Create Product</span>
        </div>
        <div className="card-content">
          <div className="card-row1">
            <label htmlFor="productImage">Image</label>
            <div>
              {productImagePath && (
                <img
                  src={URL.createObjectURL(productImagePath)}
                  alt="Preview"
                  loading="lazy"
                />
              )}
              <label type="submit" className="poppins-regular label-inp">
                <input
                  type="file"
                  accept="image/*"
                  id="productImage"
                  key={productImagePath || ""} // Reset input saat key berubah
                  onChange={(e) => setProductImagePath(e.target.files[0])}
                  className="input-image"
                />
                Upload img
              </label>
            </div>
          </div>

          <div className="card-row2">
            <div>
              <label htmlFor="productName">Name</label>
              <input
                type="text"
                id="productName"
                className="quicksand"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                maxLength={20}
              />
            </div>
            <div>
              <label htmlFor="productPrice">Price</label>
              <input
                type="number"
                id="productPrice"
                className="quicksand"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="card-row3">
            <label htmlFor="productDescription">Description</label>
            <textarea
              id="productDescription"
              className="quicksand"
              rows={4}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              maxLength={120}
            />
          </div>

          <div className="card-row4">
            <div>
              <label htmlFor="productCategory">Category</label>
              <select
                id="productCategory"
                className="quicksand"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <option value="food">Food</option>
                <option value="drink">Drink</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="isAvailable">Available?</label>
              <input
                type="checkbox"
                id="isAvailable"
                className="quicksand"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
            </div>
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

CreatePopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreatePopup;
