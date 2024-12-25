import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/menu.css";
import "../css/app.css";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Menu = ({ cart, addToCart }) => {
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://cafemdn-api.vercel.app/api/product?sort=${sort}&category=${category}&limit=${limit}&search=${search}&page=${page}`
      )
      .then((response) => {
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages); // Total halaman dari backend
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setMessage(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sort, category, search, page, limit]);

  const handleAddToCart = (product) => {
    addToCart(product);
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: `${product.productName} berhasil ditambahkan ke keranjang.`,
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const handleGoToPayment = () => {
    navigate("/payment");
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
        <div className="search-bar ">
          <div className="search">
            <label htmlFor="search" className="floating-table">
              <i className="bi bi-search"></i>
            </label>
            <input
              value={search}
              type="text"
              id="search-input"
              className="quicksand"
              placeholder="Cari menu makanan..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            id="limit"
            className="quicksand"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
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
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          <button
            className={
              category === "" ? "active poppins-regular" : "poppins-regular"
            }
            onClick={() => setCategory("")}
          >
            <i className="bi bi-list"></i> All
          </button>
          <button
            className={
              category === "food" ? "active poppins-regular" : "poppins-regular"
            }
            onClick={() => setCategory("food")}
          >
            <i className="bi bi-basket3"></i> Food
          </button>
          <button
            className={
              category === "drink"
                ? "active poppins-regular"
                : "poppins-regular"
            }
            onClick={() => setCategory("drink")}
          >
            <i className="bi bi-cup-straw"></i> Drink
          </button>
          <button
            className={
              category === "other"
                ? "active poppins-regular"
                : "poppins-regular"
            }
            onClick={() => setCategory("other")}
          >
            <i className="bi bi-grid"></i> Other
          </button>
        </div>

        {/* Menu grid */}
        <div className="container-menuGrid">
          <div className="menu-grid" id="menuGrid">
            {products.map((product) => (
              <div
                key={product._id}
                className="menu-item"
                data-name={product.productName}
                data-price={product.productPrice}
                data-category={product.productCategory}
                data-description={product.productDescription}
              >
                <img src={product.productImagePath} alt={product.productName} />
                <div className="menu-details">
                  <h3 className="poppins-regular">{product.productName}</h3>
                  <p className="description quicksand">
                    {product.productDescription}
                  </p>
                  <div className="add-to-cart">
                    <p className="price quicksand">
                      Rp {product.productPrice.toLocaleString()}
                    </p>
                    <button onClick={() => handleAddToCart(product)}>
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
          <button className="quicksand" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pg) => (
              <button
                key={pg}
                className={page === pg ? "active poppins-regular" : "poppins-regular"}
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
      </div>

      {/* Floating cart button */}
      <div className="floating-cart" onClick={handleGoToPayment}>
        <i className="bi bi-cart" style={{ fontSize: "2rem" }}></i>
        <span className="cart-count">
          {cart.reduce((total, item) => total + item.quantity, 0)}
        </span>
      </div>
    </div>
  );
};

export default Menu;
