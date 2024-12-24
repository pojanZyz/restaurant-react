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
        <div className="search-bar">
          
          <i class="bi bi-arrow-down-short"></i>
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <div className="search">
            <label htmlFor="search" className="floating-table"><i class="bi bi-search"></i></label>
          <input
            value={search}
            type="text"
            id="search-input"
            placeholder="Cari menu makanan..."
            onChange={(e) => setSearch(e.target.value)}
          />
          </div>
          <select className="sorting" id="sortOptions" onChange={(e) => setSort(e.target.value)}>
            <option value="">Default</option>
            <option value="asc">A-Z</option>
            <option value="dsc">Z-A</option>
            <option value="newest">Terbaru</option>
          </select>
        </div>

        {/* Category filter */}
        <div className="category-filter">
          {["", "food", "drink", "other"].map((cat) => (
            <button
              key={cat}
              className={category === cat ? "active" : ""}
              onClick={() => setCategory(cat)}
            >
              {cat === ""
                ? "Semua"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
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
                <h3>{product.productName}</h3>
                <p className="description">{product.productDescription}</p>
                <p className="price">
                  Rp {product.productPrice.toLocaleString()}
                </p>
              </div>
              <div className="add-to-cart">
                <button onClick={() => handleAddToCart(product)}>
                  <i className="bi bi-cart"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pg) => (
              <button
                key={pg}
                className={page === pg ? "active" : ""}
                onClick={() => setPage(pg)}
              >
                {pg}
              </button>
            )
          )}
          <button
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
