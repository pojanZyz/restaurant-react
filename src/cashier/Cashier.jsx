import React, { useState, useEffect } from "react";
import axios from "axios";

import "../admin-css/cashier.css";
import useAuth from "../js/useAuth";

const Cashier = () => {
  const [loading, setLoading] = useState(false);
  const { token, userData, tokenLoading } = useAuth();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [category, debouncedSearch, page, limit]);

  // Event handlers
  const handleCategoryChange = (catValue) => {
    setCategory(catValue);
    setPage(1);
  };

  const handleSearchChange = (searchVal) => {
    setSearch(searchVal);
    setPage(1);
  };

  const handleLimitChange = (limitVal) => {
    setLimit(limitVal);
    setPage(1);
  };

  const handleAddToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id, delta) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(item.quantity + delta, 1),
            }
          : item
      )
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/product?sort=&category=${category}&limit=${limit}&search=${debouncedSearch}&page=${page}`
      );
      setProducts(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    // Placeholder logic for invoice printing
    console.log("Invoice printed", {
      tableNumber,
      paymentMethod,
      discountCode,
      cart,
      total: calculateTotalPrice(),
    });
    alert("Invoice generated and sent to the printer.");
  };

  return (
    <div className="cashier-box">
      <div className="cashier-container quicksand">
        <div className="left-container">
          <div className="control-panel-cas">
            <div className="search-input">
              <i className="bi bi-search"></i>
              <input
                className="quicksand"
                type="search"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <div
                className="product-item-cas"
                key={product._id}
                onClick={() => handleAddToCart(product)}
              >
                <img src={product.productImagePath} alt="" loading="lazy" />
                <span className="poppins-regular">{product.productName}</span>
                <div className="product-details-cas">
                  <span>Rp. {product.productPrice}</span>
                  <div
                    className={`product-ava poppins-regular ${
                      product.isAvailable === "Available"
                        ? "p-available"
                        : "p-notava"
                    }`}
                  >
                    {product.isAvailable}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="right-container">
          <h3 className="poppins-regular">Cashier</h3>

          <div className="items-wrap">
            <h4>Items</h4>
            <hr />
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <span className="poppins-regular">{item.productName}</span>
                  <span>Rp. {item.productPrice * item.quantity}</span>
                  <div className="cart-controls">
                    <button onClick={() => handleQuantityChange(item._id, -1)}>
                      -
                    </button>
                    <span className="poppins-regular">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item._id, 1)}>
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveFromCart(item._id)}
                      className="delete-btn"
                    >
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

      <form action="">

        <div className="input-box-cashier">
          <div className="form-group-cashier">
            <label>Table Number:</label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Enter table number"
            />
          </div>

          <div className="form-group-cashier">
            <label>Total Price:</label>
            <input
              type="text"
              value={`Rp. ${calculateTotalPrice()}`}
              readOnly
            />
          </div>

          <div className="form-group-cashier">
            <label>Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>

          <div className="form-group-cashier">
            <label>Discount Code:</label>
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter discount code"
            />
          </div>

          <div className="form-group-cashier">
          <label>Coin:</label>
            <input
              type="text"
              placeholder="Enter Coin Amounts "
            />
          </div>

           <div className="btn-cashier-box">
           <button onClick={handlePrintInvoice} className="generate-invoice-btn">
           <i class="bi bi-printer-fill"></i>
           </button>

           <button type="submit" className="cashier-send-btn">Send</button>

           </div>
          

          </div>
      </form>
        
      {/* {showInvoice && (
        <div className="invoice-modal">
          <div className="invoice-content">
            <h3>Invoice</h3>
            <p>Table Number: {tableNumber}</p>
            <p>Payment Method: {paymentMethod}</p>
            <p>Discount Code: {discountCode}</p>
            <ul>
              {cart.map((item) => (
                <li key={item._id}>
                  {item.productName} x {item.quantity} - Rp. {item.productPrice * item.quantity}
                </li>
              ))}
            </ul>
            <p>Total: Rp. {calculateTotalPrice()}</p>
            <button onClick={closeInvoice}>Close</button>
          </div>
        </div>
      )} */}

        </div>
      </div>
    </div>
  );
};

export default Cashier;
