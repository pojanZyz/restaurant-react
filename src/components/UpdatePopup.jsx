import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../admin-css/admin-menu.css";

const UpdatePopup = ({ isVisible, onClose, onUpdate, product }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState("Unavailable");
  const [productPrice, setProductPrice] = useState("");
  const [productImagePath, setProductImagePath] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isVisible) {
      setProductName(product.productName || "");
      setProductDescription(product.productDescription || "");
      setProductCategory(product.productCategory || "");
      setIsAvailable(product.isAvailable || "Unavailable");
      setProductPrice(product.productPrice || "");
      setProductImagePath(product.productImagePath || "");
      setPreviewImage(product.productImagePath || "");
    }
  }, [product, isVisible]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setProductImagePath(file);
    }
  };

  const handleUpdate = () => {
    const updatedProduct = {
      _id: product._id,
      image: productImagePath,
      productName,
      productPrice,
      productDescription,
      isAvailable,
      productCategory,
    };
    onUpdate(updatedProduct);
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
          <span>Update Product</span>
        </div>
        <div className="card-content">
          <div className="card-row1">
            <label htmlFor="productImage">Image</label>
            <div>
              <img src={previewImage} alt="Preview" loading="lazy" />
              <label type="submit" className="poppins-regular label-inp">
                <input
                  type="file"
                  accept="image/*"
                  id="productImage"
                  onChange={handleImageChange}
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
                required
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
                maxLength={10}
                required
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
              required
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
                required
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
                checked={isAvailable === "Available"}
                onChange={(e) => setIsAvailable(e.target.checked ? "Available" : "Unavailable")}
                required
              />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button className="update-btn poppins-regular" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

UpdatePopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  product: PropTypes.object,
};

export default UpdatePopup;
