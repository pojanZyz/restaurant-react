import React, { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-dropdown-select";

import "../admin-css/cashier.css";
import useAuth from "../js/useAuth";
import useSnapCas from "../js/useSnapCas";
import NoData from "../components/NoData";

const Cashier = () => {
  const [loading, setLoading] = useState(false);
  const { token, userData, tokenLoading } = useAuth();
  const { triggerPayment } = useSnapCas(import.meta.env.VITE_MIDTRANS_CLIENT_KEY);

  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productCount, setProductCount] = useState(0);

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discountCode, setDiscountCode] = useState("");
  const [debouncedDiscountCode, setDebouncedDiscountCode] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [debouncedCusEmail, setDebouncedCusEmail] = useState("");
  const [customerMoney, setCustomerMoney] = useState("");

  const [discLoading, setDiscLoading] = useState(false);
  const [isDiscountValid, setIsDiscountValid] = useState("");
  const [cusEmailLoading, setCusEmailLoading] = useState(false);
  const [isCusEmailValid, setIsCusEmailValid] = useState("");

  const [discountsDetails, setDiscountsDetails] = useState({});

  //debounces
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    const delay = setTimeout(
      () => setDebouncedDiscountCode(discountCode),
      1000
    );
    return () => clearTimeout(delay);
  }, [discountCode]);
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedCusEmail(customerEmail), 1000);
    return () => clearTimeout(delay);
  }, [customerEmail]);

  //get all products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/product?sort=&category=&limit=${limit}&search=${debouncedSearch}&page=${page}`
      );
      setProducts(res.data.data);
      setProductCount(res.data.dataCount);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, limit]);

  //get all tables
  const fetchTables = useCallback(async () => {
    try {
      const res = await axios.get(`api/table-for-cas`);
      setTables(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  //check disc code
  const checkDiscountCode = useCallback(async () => {
    if (discountCode === "") {
      setDiscountsDetails({});
      setIsDiscountValid("");
      return;
    }
    setDiscLoading(true);
    try {
      const res = await axios.get(`api/discount/${debouncedDiscountCode}`);
      if (res.status === 200) {
        setIsDiscountValid("valid");
        setDiscountsDetails({
          discountId: res.data._id,
          discountValue: res.data.discountValue,
          discountType: res.data.discountType,
        });
      } else {
        setIsDiscountValid("invalid");
        setDiscountsDetails({});
      }
    } catch (error) {
      console.error(error);
      setIsDiscountValid("invalid");
    } finally {
      setDiscLoading(false);
    }
  }, [debouncedDiscountCode]);

  //check cus email
  const checkCustomerEmail = useCallback(async () => {
    if (customerEmail == "") return setIsCusEmailValid("");
    setCusEmailLoading(true);
    try {
      const res = await axios.get(`api/user-by-email/${customerEmail}`);
      setIsCusEmailValid(res.status === 200 ? "valid" : "invalid");
    } catch (error) {
      console.error(error);
      setIsCusEmailValid("invalid");
    } finally {
      setCusEmailLoading(false);
    }
  }, [debouncedCusEmail]);

  //create order
  const handleOrder = async (e) => {
    e.preventDefault();
    if (!cart.length || !paymentMethod) {
      return Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please complete the inputs",
      });
    }
    if(isCusEmailValid === "invalid" || isDiscountValid === "invalid"){
      return Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Email or Discount code is invalid",
      });
    }
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Confirm the order creation?",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setLoading(true);
      try {
        const selectedProducts = cart.map((item) => ({
          productId: item._id,
          productName: item.productName,
          quantity: item.quantity,
          productPrice: item.productPrice,
        }));

        const res = await axios.post(
          "api/order",
          {
            products: selectedProducts,
            finalPrice: calculateFinalPrice(),
            paymentMethod: paymentMethod,
            tableId: selectedTable[0]?._id || null,
            customerEmail: customerEmail || null,
            cashierId: userData?._id || null,
            discountId: discountsDetails.discountId || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCart([]);
        setCustomerEmail("");
        setSelectedTable([]);
        setDiscountCode("");
        setPaymentMethod("Cash");
        setCustomerMoney("");

        //cash payment ends here
        if (!res.data.snapToken) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.data.message || "New order created!",
            timer: 2000,
            showConfirmButton: false,
          });
        }

        if (res.data.snapToken) {
          const snapToken = res.data.snapToken;
          const orderId = res.data.orderId;
          triggerPayment(snapToken, orderId);
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to make order",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);
  useEffect(() => {
    checkDiscountCode();
  }, [checkDiscountCode]);
  useEffect(() => {
    checkCustomerEmail();
  }, [checkCustomerEmail]);

  //events handler
  const handleSearchChange = (searchVal) => {
    setSearch(searchVal);
    setPage(1);
  };
  const handleLimitChange = (limitVal) => {
    setLimit(limitVal);
    setPage(1);
  };

  //add to cart
  const handleAddToCart = (product) => {
    if (product.isAvailable === "Unavailable") {
      return Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Sorry! the product is unavailable!",
      });
    }
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

  //cart handle
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

  //pricing handling
  const calculateTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  };
  const calculateDiscount = () => {
    if (!discountsDetails) return 0;
    if (discountsDetails.discountType === "fixed") {
      return discountsDetails.discountValue;
    }

    if (discountsDetails.discountType === "percentage") {
      const totalPrice = calculateTotalPrice();
      const percentageDiscount = discountsDetails.discountValue / 100;
      return totalPrice * percentageDiscount;
    }
    return 0;
  };
  const calculateFinalPrice = () => {
    return calculateTotalPrice() - calculateDiscount();
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
            <select
              className="quicksand"
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          {loading ? (
            <div className="poppins-regular">Wait..</div>
          ) : productCount === 0 ? (
            <NoData str={"No product found"} />
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <div
                    className="product-item-cas"
                    key={product._id}
                    onClick={() => handleAddToCart(product)}
                  >
                    <img src={product.productImagePath} alt="" loading="lazy" />
                    <span className="poppins-regular">
                      {product.productName}
                    </span>
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

              <div className="pagination pagination-cashier">
                <button
                  className="quicksand"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pg) => (
                  <button
                    key={pg}
                    className={`page-btn
                  ${
                    page === pg
                      ? "active-btn poppins-regular"
                      : "poppins-regular"
                  }`}
                    onClick={() => setPage(pg)}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  className="quicksand"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        <div className="right-container">
          <h3 className="poppins-regular">
            Cashier <span className="order-type-cas">CAS</span>
          </h3>

          <div className="right-con1">
            <div className="items-wrap">
              <h4>Items</h4>
              <hr />
              {cart.length === 0 ? (
                <div className="no-cart">
                  <i className="bi bi-info-circle-fill"></i>
                  <h4>TIP</h4>
                  <p>Select the product in the left side of the screen</p>
                </div>
              ) : (
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item._id} className="cart-item">
                      <div className="cart-item-details">
                        <img
                          src={item.productImagePath}
                          alt={item.productName}
                        />
                        <div className="cart-item-details-ext">
                          <span className="poppins-regular">
                            {item.productName}
                          </span>
                          <span>
                            Rp. {item.productPrice.toLocaleString("id-ID")}
                            {item.quantity === 1 ? "" : ` x${item.quantity}`}
                          </span>
                        </div>
                      </div>
                      <div className="cart-controls">
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                        >
                          -
                        </button>
                        <span className="poppins-regular">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item._id)}
                          className="delete-btn"
                        >
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="pricing-details">
              <div className="form-group">
                <label>Sub Total</label>
                <h5>Rp. {calculateTotalPrice().toLocaleString("id-ID")}</h5>
              </div>
              <div className="form-group">
                <label>Tax</label>
                <h5>Rp. -</h5>
              </div>
              <div className="form-group">
                <label>Discount</label>
                <h5>
                  {discountsDetails.discountType === "percentage"
                    ? `${discountsDetails.discountValue}%`
                    : discountsDetails.discountType === "fixed"
                    ? `Rp. ${discountsDetails.discountValue}`
                    : "-"}
                </h5>
              </div>
              <div className="form-group">
                <label>Final Price</label>
                <h2>
                  Rp. {calculateFinalPrice().toLocaleString("id-ID") || "-"}
                </h2>
              </div>
            </div>
          </div>

          <form className="cas-form" onSubmit={handleOrder}>
            {/* Informasi Pelanggan */}
            <div className="fcas-row-1">
              <div className="form-group">
                <label>Table Number</label>
                <Select
                  options={tables}
                  values={selectedTable}
                  onChange={(values) => setSelectedTable(values)}
                  labelField="tableNumber"
                  valueField="_id"
                  searchable
                  searchBy="tableNumber"
                  placeholder="Search.."
                  noDataLabel="No data found"
                  className="select-table quicksand"
                  dropdownHeight="200px"
                />
              </div>
              <div className="form-group">
                <label>Customer Email</label>
                <div className="cas-special-input">
                  <input
                    className="quicksand"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter customer email"
                  />
                  <div className="disc-status">
                    {cusEmailLoading ? (
                      <div className="small-loader"></div>
                    ) : isCusEmailValid === "valid" ? (
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ color: "green" }}
                      ></i>
                    ) : isCusEmailValid === "invalid" ? (
                      <i
                        className="bi bi-x-circle-fill"
                        style={{ color: "red" }}
                      ></i>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Discount Code</label>
                <div className="cas-special-input">
                  <input
                    className="quicksand"
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code"
                  />
                  <div className="disc-status">
                    {discLoading ? (
                      <div className="small-loader"></div>
                    ) : isDiscountValid === "valid" ? (
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ color: "green" }}
                      ></i>
                    ) : isDiscountValid === "invalid" ? (
                      <i
                        className="bi bi-x-circle-fill"
                        style={{ color: "red" }}
                      ></i>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div className="fcas-row2">
              <div className="form-group-row2">
                <label>Payment Method</label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={paymentMethod === "Cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />{" "}
                  Cash
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />{" "}
                  Online (via Midtrans)
                </label>
              </div>

              <div className="form-group-row2">
                {paymentMethod === "Cash" ? (
                  <>
                    <label>Customer money</label>
                    <input
                      className="quicksand customer-money"
                      type="number"
                      value={customerMoney}
                      onChange={(e) => setCustomerMoney(e.target.value)}
                      placeholder="Enter customer money"
                    />
                    <span className="change-mny">
                      {customerMoney === ""
                        ? ""
                        : customerMoney < calculateFinalPrice()
                        ? "Not enough money"
                        : `Change: Rp. ${(
                            customerMoney - calculateFinalPrice()
                          ).toLocaleString("id-ID")}`}
                    </span>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="form-section">
              <button
                onClick={handleOrder}
                className="order-btn poppins-regular"
              >
                Done
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cashier;