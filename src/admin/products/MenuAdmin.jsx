import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";

import "./admin-menu.css";
import useAuth from "../../js/useAuth";
import CreatePopup from "./CreatePopup";
import UpdatePopup from "./UpdatePopup";
import NoData from "../../components/NoData";
import Loader from "../../components/Loader";
import ProductStat from "./ProductStat";
import { Helmet } from "react-helmet";

const MenuAdmin = () => {
  const { token, userData, getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [catCount, setCatCount] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    fetchProducts();
  }, [sort, category, debouncedSearch, page, limit]);
  useEffect(() => {
    fetchProdStats();
  }, []);

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

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  //get all products
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
  //get best selling products
  const fetchProdStats = async () => {
    try {
      const res = await axios.get("api/product-stats");
      setCatCount(res.data.catCount);
      setBestSellingProducts(res.data.bestSellings);
    } catch (error) {
      console.error("Failed to fetch best-selling products:", error);
    }
  };

  //handle create
  const handleCreate = async (newProduct) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      setShowCreatePopup(false);
      setLoading(true);
      try {
        const compressedImage = await compressImage(newProduct.image);
        const finalIsAvailable =
          newProduct.isAvailable === true ? "Available" : "Unavailable";
        const formData = new FormData();
        formData.append("productName", newProduct.productName);
        formData.append("productDescription", newProduct.productDescription);
        formData.append("productPrice", newProduct.productPrice);
        formData.append("productCategory", newProduct.productCategory);
        formData.append("isAvailable", finalIsAvailable);
        formData.append("image", compressedImage);

        const res = await axios.post(`api/product`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
          showConfirmButton: false,
          timer: 2000,
        });
        fetchProducts();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  //handle btn update
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowUpdatePopup(!showUpdatePopup);
  };

  //handle update
  const handleUpdate = async (updatedProduct) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      setShowUpdatePopup(false);
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("productName", updatedProduct.productName);
        formData.append(
          "productDescription",
          updatedProduct.productDescription
        );
        formData.append("productPrice", updatedProduct.productPrice);
        formData.append("productCategory", updatedProduct.productCategory);
        formData.append("isAvailable", updatedProduct.isAvailable);
        if (updatedProduct.image && updatedProduct.image instanceof File) {
          const compressedImage = await compressImage(updatedProduct.image);
          formData.append("image", compressedImage);
        }

        const res = await axios.put(
          `api/product/${updatedProduct._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
          showConfirmButton: false,
          timer: 2000,
        });
        fetchProducts();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  //handle delete
  const handleDelete = async (productId) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      setLoading(true);
      setShowUpdatePopup(false);
      try {
        const res = await axios.delete(`api/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "info",
          title: "Information",
          text: res.data.message,
          showConfirmButton: false,
          timer: 2000,
        });
        fetchProducts();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>CafeCoding | Admin-Products</title>
      </Helmet>
      <div className="body-box">
        {loading && (
          <div className="loader-overlay">
            <Loader />
          </div>
        )}
        <div className="admin-menu-container quicksand">
          <div className="admin-menu-con1">
            <h2 className="poppins-regular">
              <i className="bi bi-cart-fill judul"></i>{" "}
              <span className="judul">Your products</span>
            </h2>
          </div>

          <div className="admin-menu-con2">
            <ProductStat
              productCount={productCount}
              bestSellingProducts={bestSellingProducts}
              catCount={catCount}
            />
          </div>

          <div className="admin-menu-con3">
            <div className="filters">
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
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="asc">A-Z</option>
                <option value="dsc">Z-A</option>
                <option value="oldest">Oldest</option>
              </select>
              <select
                className="quicksand"
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">All</option>
                <option value="food">Food</option>
                <option value="drink">Drink</option>
                <option value="other">Other</option>
              </select>
              <select
                className="quicksand"
                onChange={(e) => handleLimitChange(e.target.value)}
              >
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="80">80</option>
              </select>
            </div>
            <div className="products-wrap">
              <div className="products-grid">
                <div
                  className="product-item-grid"
                  onClick={() => setShowCreatePopup(!showCreatePopup)}
                >
                  <div className="plus-icon">
                    <i className="bi bi-plus-square-dotted"></i>
                    <p>Add new product</p>
                  </div>
                  <h4 className="add-h4">{"-"}</h4>
                  <span className="add-span">{"-"}</span>
                </div>
                {products.length === 0 || productCount === 0 ? (
                  <NoData str={"No product found"} />
                ) : (
                  products.map((product) => (
                    <div
                      className="product-item-grid"
                      key={product._id}
                      onClick={() => handleEdit(product)}
                    >
                      <img
                        src={product.productImagePath}
                        alt={product.productName}
                      />
                      <h4 className="poppins-regular">{product.productName}</h4>
                      <span>
                        Rp{product.productPrice.toLocaleString("id-ID")}
                      </span>
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
              )}
            </div>
          </div>
        </div>
        {/* update popup */}
        <UpdatePopup
          isVisible={showUpdatePopup}
          onClose={() => setShowUpdatePopup(false)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          product={selectedProduct}
        />

        {/* create popup */}
        <CreatePopup
          isVisible={showCreatePopup}
          onClose={() => setShowCreatePopup(false)}
          onCreate={handleCreate}
        />
      </div>
    </>
  );
};

export default MenuAdmin;
