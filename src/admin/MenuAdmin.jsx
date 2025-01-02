import React, { useState, useEffect } from "react";
import axios from "axios";

import "../admin-css/admin-menu.css";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import useAuth from "../js/useAuth";
import UpdatePopup from "../components/UpdatePopup";
import CreatePopup from "../components/CreatePopup";
import NoData from "../components/NoData";

const MenuAdmin = () => {
  const { token, userData, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("")
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

  //handle create
  const handleCreate = async (newProduct) => {
    const confirmation = confirm("Are you sure?");
    console.log(newProduct);
    if (confirmation) {
      setShowCreatePopup(false);
      setLoading(true);
      try {
        const finalIsAvailable =
          newProduct.isAvailable === true ? "Available" : "Unavailable";
        const formData = new FormData();
        formData.append("productName", newProduct.productName);
        formData.append("productDescription", newProduct.productDescription);
        formData.append("productPrice", newProduct.productPrice);
        formData.append("productCategory", newProduct.productCategory);
        formData.append("isAvailable", finalIsAvailable);
        formData.append("image", newProduct.image);

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
        if (updatedProduct.image) {
          formData.append("image", updatedProduct.image);
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
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="admin-menu-container quicksand">
        <div className="admin-menu-con1">
          <h2 className="poppins-regular">
            <i className="bi bi-cart-fill"></i> Your products
          </h2>
        </div>
        <div className="admin-menu-con2">
          <div className="control-panel-admin">
            <div className="control-panel-main">
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
                <option value="">Default</option>
                <option value="asc">A-Z</option>
                <option value="dsc">Z-A</option>
                <option value="newest">Terbaru</option>
              </select>
              <select
                className="quicksand"
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <button
                className="add-product-btn poppins-regular"
                onClick={() => setShowCreatePopup(!showCreatePopup)}
              >
                <i className="bi bi-plus-square"></i> Add new product
              </button>
            </div>
            <div className="controlpanel-extend">
              <button
                className={
                  category === ""
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => handleCategoryChange("")}
              >
                <i className="bi bi-list"></i> All
              </button>
              <button
                className={
                  category === "food"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => handleCategoryChange("food")}
              >
                <i className="bi bi-basket3"></i> Food
              </button>
              <button
                className={
                  category === "drink"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => handleCategoryChange("drink")}
              >
                <i className="bi bi-cup-straw"></i> Drink
              </button>
              <button
                className={
                  category === "other"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => handleCategoryChange("other")}
              >
                <i className="bi bi-grid"></i> Other
              </button>
            </div>
          </div>

          {productCount === 0 ? (
            <NoData str={"No product found"} />
          ) : (
            <>
              <div className="count-con">
                <div>
                  <span className="poppins-regular">
                    {productCount || 0}
                    <i className="bi bi-cart-fill"></i>
                  </span>
                  <span className="span-2">PRODUCTS</span>
                </div>
                <div>
                  <i className="bi bi-columns"></i>
                  <span className="span-2">
                    Page {page} of {totalPages}
                  </span>
                </div>
              </div>
              <div className="product-box">
                {products.map((product) => (
                  <div className="product-item" key={product._id}>
                    <img src={product.productImagePath} alt="" loading="lazy" />
                    <span className="poppins-regular product-name">
                      {product.productName}
                    </span>
                    <div className="product-details">
                      <span>Rp. {product.productPrice}</span>
                      <span>{product.isAvailable}</span>
                    </div>
                    <div className="product-action-btn">
                      <button
                        className="update-btn quicksand"
                        title="Update this product"
                        onClick={() => handleEdit(product)}
                      >
                        Update
                      </button>
                      <button
                        className="delete-btn quicksand"
                        title="Delete this product"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
            </>
          )}
        </div>
      </div>
      {/* update popup */}
      <UpdatePopup
        isVisible={showUpdatePopup}
        onClose={() => setShowUpdatePopup(false)}
        onUpdate={handleUpdate}
        product={selectedProduct}
      />

      {/* create popup */}
      <CreatePopup
        isVisible={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default MenuAdmin;
