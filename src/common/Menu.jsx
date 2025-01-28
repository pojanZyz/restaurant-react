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
        `api/product?sort=${sort}&category=${category}&limit=${limit}&search=${debouncedSearch}&page=${page}`
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

  return (
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

      <div className="menu-container">
        {/* Search bar */}
        <div className="control-panel ">
          <div className="search">
            <i className="bi bi-search"></i>
            <input
              value={search}
              type="text"
              className="quicksand"
              placeholder="Search..."
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <select
            className="sorting quicksand"
            id="sortOptions"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Default</option>
            <option value="asc">A-Z</option>
            <option value="dsc">Z-A</option>
            <option value="newest">Terbaru</option>
          </select>
          <select
            id="limit"
            className="quicksand"
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
          >
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={80}>80</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <button
            className={
              category === "" ? "active poppins-regular" : "poppins-regular"
            }
            onClick={() => handleCategoryChange("")}
          >
            <i className="bi bi-list"></i> All
          </button>
          <button
            className={
              category === "food" ? "active poppins-regular" : "poppins-regular"
            }
            onClick={() => handleCategoryChange("food")}
          >
            <i className="bi bi-basket3"></i> Food
          </button>
          <button
            className={
              category === "drink"
                ? "active poppins-regular"
                : "poppins-regular"
            }
            onClick={() => handleCategoryChange("drink")}
          >
            <i className="bi bi-cup-straw"></i> Drink
          </button>
          <button
            className={
              category === "other"
                ? "active poppins-regular"
                : "poppins-regular"
            }
            onClick={() => handleCategoryChange("other")}
          >
            <i className="bi bi-grid"></i> Other
          </button>
        </div>

        {productCount === 0 ? (
          <NoData str={"No product found"} />
        ) : (
          <>
            {/* Menu grid */}
            <div className="container-menuGrid">
              <div className="menu-grid" id="menuGrid">
                {products.map((product) => (
                  <div key={product._id} className="menu-item">
                    <img
                      src={product.productImagePath}
                      alt={product.productName}
                    />
                    <div className="menu-details">
                      <h3 className="poppins-regular">{product.productName}</h3>
                      <p className="description quicksand">
                        {product.productDescription}
                      </p>
                      <div className="add-to-cart">
                        <p className="price quicksand">
                          Rp {product.productPrice.toLocaleString()}
                        </p>
                        <button>
                          <i className="bi bi-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
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
                    className={
                      page === pg ? "active poppins-regular" : "poppins-regular"
                    }
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
          </>
        )}
      </div>

      {/* Floating cart button */}
      <div className="floating-cart" onClick={() => navigate("/order")}>
        <i className="bi bi-cart" style={{ fontSize: "2rem" }}></i>
        <span className="cart-count">0</span>
      </div>
    </div>
  );
};

export default Menu;
