import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NoData from "../components/NoData";
import Swal from "sweetalert2";

import "../css/menu.css";
import Loader from "../components/Loader";

const Menu = () => {
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productCount, setProductCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [sort, category, debouncedSearch, page, limit]);

  //events handler
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/product?sort=asc&category=${category}&limit=${limit}&search=${debouncedSearch}&page=${page}`
      );
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
      setProductCount(res.data.dataCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    Swal.fire({
      icon: "success",
      title: "Success",
      text: `${product.productName} has been added to your cart!`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="menu-container quicksand">
        <div className="menu-con1">
          <h2 className="poppins-regular">
            <i className="bi bi-cart"></i> Menu
          </h2>
        </div>

        <div className="menu-con2">
          <div className="menu-filters">
            <div className="fil-row-1">
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
                onChange={(e) => handleLimitChange(e.target.value)}
              >
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="80">80</option>
              </select>
            </div>

            <div className="cat-btn-group">
              <button
                className={` ${
                  category === "" ? "cat-active" : ""
                } all-btn poppins-regular`}
                onClick={() => handleCategoryChange("")}
              >
                <i className="bi bi-list"></i> All
              </button>
              <button
                className={`${
                  category === "food" ? "cat-active" : ""
                } food-btn poppins-regular`}
                onClick={() => handleCategoryChange("food")}
              >
                <i className="bi bi-egg-fried"></i> Food
              </button>
              <button
                className={` ${
                  category === "drink" ? "cat-active" : ""
                } drink-btn poppins-regular`}
                onClick={() => handleCategoryChange("drink")}
              >
                <i className="bi bi-cup-straw"></i>
                Drink
              </button>
              <button
                className={` ${
                  category === "other" ? "cat-active" : ""
                } other-btn poppins-regular`}
                onClick={() => handleCategoryChange("other")}
              >
                Other
              </button>
            </div>
          </div>

          <div className="table-det">
            <div className="page-ttl">
              <i className="bi bi-columns"></i>
              <span className="span-2">
                Page {page} of {totalPages}
              </span>
            </div>
            <div className="page-ttl">
              <i className="bi bi-cart"></i>
              <span className="span-2">{products.length} Products</span>
            </div>
          </div>

          <div className="menu-grid">
            {productCount === 0 ? (
              <NoData str={"No product found"} />
            ) : (
              products.map((product) => (
                <div className="menu-grid-item" key={product._id}>
                  <img
                    src={product.productImagePath}
                    alt={product.productName}
                  />
                  <div className="menu-det">
                    <div>
                      <h5 className="poppins-regular">{product.productName}</h5>
                      <p>{product.productDescription}</p>
                      <span>
                        Rp{product.productPrice.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <button
                      className="poppins-regular"
                      onClick={() => addToCart(product)}
                    >
                      <i className="bi bi-cart"></i> Add to cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {productCount === 0 ? (
            ""
          ) : (
            <div className="pagination">
              <button
                className="quicksand"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pg) => (
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
                )
              )}
              <button
                className="quicksand"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="floating-cart" onClick={() => navigate("/order")}>
        <i className="bi bi-cart" style={{ fontSize: "2rem" }}></i>
        <span className="cart-count">
          {cart.reduce((acc, item) => acc + item.quantity, 0)}
        </span>
      </div>
    </div>
  );
};

export default Menu;
