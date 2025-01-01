import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const MenuTable = ({ searchMenu, setSearchMenu }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    const searchQuery = searchMenu ? searchMenu : "";

    axios
      .get(
        `https://cafemdn-api.vercel.app/api/product?limit=${limit}&search=${searchQuery}&page=${page}`
      )
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.error(error.response ? error.response.data.message : error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchMenu, page, limit]);

  const handleToggleAvailability = (id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === id
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      )
    );
  };

  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Produk ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://cafemdn-api.vercel.app/api/product/${id}`)
          .then((response) => {
            Swal.fire("Terhapus!", "Produk telah dihapus dari database.", "success");
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product._id !== id)
            );
          })
          .catch((error) => {
            Swal.fire("Gagal!", "Ada masalah saat menghapus produk.", "error");
            console.error(error);
          });
      }
    });
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = () => {
    // Menampilkan konfirmasi dengan SweetAlert2 sebelum update
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data produk akan diperbarui!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Update!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Mengirimkan seluruh data produk
        const updatedProduct = {
          _id: currentProduct._id,  // Menambahkan ID produk agar data tetap dikenali
          productName: currentProduct.productName,
          productCategory: currentProduct.productCategory,
          productPrice: currentProduct.productPrice,
          productDescription: currentProduct.productDescription,
          isAvailable: currentProduct.isAvailable,
          productImagePath: currentProduct.productImagePath, // pastikan ini ada jika perlu
        };

        axios
          .put(`https://cafemdn-api.vercel.app/api/product/${currentProduct._id}`, updatedProduct)
          .then((response) => {
            Swal.fire("Diperbarui!", "Produk telah diperbarui.", "success");
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product._id === currentProduct._id ? currentProduct : product
              )
            );
            setShowEditModal(false);
          })
          .catch((error) => {
            Swal.fire("Gagal!", "Ada masalah saat memperbarui produk.", "error");
            console.error(error);
          });
      }
    });
  };

  const columns = [
    {
      name: "No",
      cell: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Image",
      cell: (row) => <img src={row.productImagePath} alt={row.productName} style={{ width: "50px" }} />,
    },
    {
      name: "Product Name",
      selector: (row) => row.productName,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.productCategory,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `Rp ${row.productPrice.toLocaleString()}`,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.productDescription,
    },
    {
      name: "Stock",
      cell: (row) => (
        <button
          onClick={() => handleToggleAvailability(row._id)}
          className={`btn btn-sm ${row.isAvailable ? "btn-success" : "btn-danger"}`}
        >
          {row.isAvailable ? <i className="bi bi-check-circle"></i> : <i className="bi bi-x-circle"></i>}
        </button>
      ),
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button onClick={() => handleEditProduct(row)} className="btn btn-info btn-sm">
            <i className="bi bi-pencil-square"></i>
          </button>
          <button onClick={() => handleDeleteProduct(row._id)} className="btn btn-danger btn-sm ml-2">
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="body-box">
      <div className="menu-container">
        <section className="crud-section">
          <h3>CRUD MENU</h3>
          <input
            type="text"
            placeholder="Search Menu"
            value={searchMenu}
            onChange={(e) => setSearchMenu(e.target.value)}
          />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DataTable columns={columns} data={products} title="Menu" pagination />
          )}
        </section>
      </div>

      {/* Modal Form Edit */}
      {showEditModal && currentProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Product</h3>
            <div>
              <label>Product Name</label>
              <input
                type="text"
                value={currentProduct.productName}
                onChange={(e) => setCurrentProduct({ ...currentProduct, productName: e.target.value })}
              />
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                value={currentProduct.productCategory}
                onChange={(e) => setCurrentProduct({ ...currentProduct, productCategory: e.target.value })}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                value={currentProduct.productPrice}
                onChange={(e) => setCurrentProduct({ ...currentProduct, productPrice: e.target.value })}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                value={currentProduct.productDescription}
                onChange={(e) => setCurrentProduct({ ...currentProduct, productDescription: e.target.value })}
              />
            </div>
            <div>
              <button onClick={handleUpdateProduct} className="btn btn-success">
                Update Product
              </button>
              <button onClick={() => setShowEditModal(false)} className="btn btn-secondary ml-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
=======
import axios from "axios";

import "../admin-css/admin-menu.css";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import useAuth from "../js/useAuth";
import UpdatePopup from "../components/UpdatePopup";
import CreatePopup from "../components/CreatePopup";

const MenuAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const { token, userData, getToken } = useAuth();
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [sort, category, search, page, limit]);

  const fetchProducts = async (req, res) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/product?sort=${sort}&category=${category}&limit=${limit}&search=${search}&page=${page}`
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
                  onChange={(e) => setSearch(e.target.value)}
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
                onChange={(e) => setLimit(Number(e.target.value))}
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
                onClick={() => setCategory("")}
              >
                <i className="bi bi-list"></i> All
              </button>
              <button
                className={
                  category === "food"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => setCategory("food")}
              >
                <i className="bi bi-basket3"></i> Food
              </button>
              <button
                className={
                  category === "drink"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => setCategory("drink")}
              >
                <i className="bi bi-cup-straw"></i> Drink
              </button>
              <button
                className={
                  category === "other"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => setCategory("other")}
              >
                <i className="bi bi-grid"></i> Other
              </button>
            </div>
          </div>
          <div className="count-con">
            <div>
              <span className="poppins-regular">
                {productCount || 0}
                <i className="bi bi-cart-fill"></i>
              </span>
              <span className="span-2">PRODUCTS</span>
            </div>
            <div>
              <i class="bi bi-columns"></i>
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
        </div>
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
>>>>>>> 95b76e1 (Initial commit)
    </div>
  );
};

<<<<<<< HEAD
export default MenuTable;
=======
export default MenuAdmin;
>>>>>>> 95b76e1 (Initial commit)
