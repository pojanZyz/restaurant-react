import React, { useState, useEffect } from "react";
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
    </div>
  );
};

export default MenuTable;
