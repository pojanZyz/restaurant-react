// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../css/menu.css";
// import "../css/app.css";

// const Menu = () => {
//   const [sort, setSort] = useState("");
//   const [category, setCategory] = useState("");
//   const [products, setProducts] = useState([]);
//   const [limit, setLimit] = useState(10);
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     axios
//       .get(
//         `https://0v09g8p4-8080.asse.devtunnels.ms/api/product?sort=${sort}&category=${category}&limit=${limit}&search=${search}&page=${page}`
//       )
//       .then((response) => {
//         setProducts(response.data.data);
//         console.log(response.data.data);
//       })
//       .catch((error) => {
//         console.log(error.response.data.message);
//         setMessage(error.response.data.message);
//       });
//   }, [sort, category, search, page, limit]);
//   return (
//     <>
//       <div className="body-box">
//         <div className="menu-container">
//           <div className="search-bar">
//             <input
//               value={search}
//               type="text"
//               id="search"
//               placeholder="Cari menu makanan..."
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <select id="sortOptions" onChange={(e) => setSort(e.target.value)}>
//               <option value="">Default</option>
//               <option value="asc">A-Z</option>
//               <option value="dsc">Z-A</option>
//               <option value="newest">Terbaru</option>
//             </select>
//           </div>

//           <div className="category-filter">
//             {["", "food", "drink", "other"].map((cat) => (
//               <button
//                 key={cat}
//                 className={category === cat ? "active" : ""}
//                 onClick={() => setCategory(cat)}
//               >
//                 {cat === "" ? "Semua" : cat.charAt(0).toUpperCase() + cat.slice(1)}
//               </button>
//             ))}
//           </div>

//           <div className="menu-grid" id="menuGrid">
//             {products.map((product, index) => (
//               <div
//                 key={product._id}
//                 className="menu-item"
//                 data-name={product.productName}
//                 data-price={product.productPrice}
//                 data-category={product.productCategory}
//               >
//                 <img src={product.productImagePath} alt={product.productName} />
//                 <div className="menu-details">
//                   <h3>{product.productName}</h3>
//                   <p className="price">
//                     Rp {product.productPrice.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="add-to-cart">
//                   <button>Tambah ke Keranjang</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Menu;



import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/menu.css";
import "../css/app.css";
import Loader from "../components/Loader";

const Menu = ({ addToCart }) => { // Terima addToCart dari props
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true)
    axios
      .get(
        `https://cafemdn-api.vercel.app/api/product?sort=${sort}&category=${category}&limit=${limit}&search=${search}&page=${page}`
      )
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setMessage(error.response.data.message);
      })
      .finally(() => {
        setLoading(false)
      })
  }, [sort, category, search, page, limit]);

  return (
    <div className="body-box">
      <div className="menu-container">
        <div className="search-bar">
          <input
            value={search}
            type="text"
            id="search"
            placeholder="Cari menu makanan..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <select id="sortOptions" onChange={(e) => setSort(e.target.value)}>
            <option value="">Default</option>
            <option value="asc">A-Z</option>
            <option value="dsc">Z-A</option>
            <option value="newest">Terbaru</option>
          </select>
        </div>

        <div className="category-filter">
          {["", "food", "drink", "other"].map((cat) => (
            <button
              key={cat}
              className={category === cat ? "active" : ""}
              onClick={() => setCategory(cat)}
            >
              {cat === "" ? "Semua" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="menu-grid" id="menuGrid">
          {loading ? (<Loader />) : (

          products.map((product) => (
            <div
              key={product._id}
              className="menu-item"
              data-name={product.productName}
              data-price={product.productPrice}
              data-category={product.productCategory}
            >
              <img src={product.productImagePath} alt={product.productName} />
              <div className="menu-details">
                <h3>{product.productName}</h3>
                <p className="price">Rp {product.productPrice.toLocaleString()}</p>
              </div>
              <div className="add-to-cart">
                <button onClick={() => addToCart(product)}>Tambah ke Keranjang</button>
              </div>
            </div>
          ))
          )}

        </div>
           {/* Pagination */}
        <div className="pagination">
          <button
            // onClick={() => handlePageChange(page - 1)}
            // disabled={page === 1}
          >
            Previous
          </button>
          {/*
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              // key={i + 1}
              // onClick={() => handlePageChange(i + 1)}
              // className={page === i + 1 ? "active" : ""}
            >
             { i + 1}
            </button>
          ))} */}
          <button
            // onClick={() => handlePageChange(page + 1)}
            // disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
