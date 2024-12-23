import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Menu from "./common/Menu";
import Sidebar from "./components/Sidebar";
import Payment from "./common/Payment";
import Pemesanan from "./common/Pemesanan";
import Login from "./common/Login";
import Register from "./common/Register";
import Feedback from "./common/Feedback";
import Home from "./common/Home";
import Loyalty from "./common/Loyalty";

import AdminHome from "./admin/AdminHome";
import MenuAdmin from "./admin/MenuAdmin";
import ReservationAdmin from "./admin/ReservationAdmin";
import OrderAdmin from "./admin/OrderAdmin";
import UserAdmin from "./admin/UserAdmin";

function App() {
  const location = useLocation();
  const [cart, setCart] = useState([]); // Cart yang akan digunakan untuk seluruh aplikasi
  const [showReceipt, setShowReceipt] = useState(false);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0); // Total setelah diskon
  const [discountAmount, setDiscountAmount] = useState(0); // Jumlah diskon
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState("Delivery");
  const [paymentMethod, setPaymentMethod] = useState("TF");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  const hideSidebar = ["/login", "/register"];

  // Fungsi untuk menambah produk ke dalam keranjang
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);

      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: item.productPrice * (item.quantity + 1),
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          { ...product, quantity: 1, totalPrice: product.productPrice },
        ];
      }
    });
  };

  // Fungsi untuk menghapus produk dari keranjang
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  // Fungsi untuk mengurangi jumlah produk
  const handleDecrease = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item._id === id) {
            const updatedQuantity = item.quantity - 1;
            const updatedTotalPrice = item.productPrice * updatedQuantity;

            if (updatedQuantity <= 0) {
              return null;
            } else {
              return {
                ...item,
                quantity: updatedQuantity,
                totalPrice: updatedTotalPrice,
              };
            }
          }
          return item;
        })
        .filter((item) => item !== null);

      return updatedCart;
    });
  };

  // Fungsi untuk menambah jumlah produk
  const handleIncrease = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item._id === id) {
          const updatedQuantity = item.quantity + 1;
          const updatedTotalPrice = item.productPrice * updatedQuantity;

          return {
            ...item,
            quantity: updatedQuantity,
            totalPrice: updatedTotalPrice,
          };
        }
        return item;
      });

      return updatedCart;
    });
  };

  // Fungsi untuk menangani diskon
  const handleDiscountMenu = () => {
    if (discountCode === "DISKON20") {
      setDiscountAmount(20000); // Diskon Rp 20.000
      setTotalAfterDiscount(
        cart.reduce((acc, item) => acc + item.totalPrice, 0) - 20000
      );
    } else {
      alert("Kode diskon tidak valid");
    }
  };

  axios.defaults.withCredentials = true;

  return (
    <>
      {!hideSidebar.includes(location.pathname) && <Sidebar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loyalty" element={<Loyalty />} />
        <Route
          path="/menu"
          element={<Menu cart={cart} addToCart={addToCart} />}
        />
        <Route
          path="/payment"
          element={
            <Payment
              cart={cart}
              totalAfterDiscount={totalAfterDiscount}
              customerName={customerName}
              setCustomerName={setCustomerName}
              orderType={orderType}
              setOrderType={setOrderType}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
              discountCode={discountCode}
              setDiscountCode={setDiscountCode}
              discountAmount={discountAmount}
              showReceipt={showReceipt}
              setShowReceipt={setShowReceipt}
              handleIncrease={handleIncrease}
              handleDecrease={handleDecrease}
              handleDiscountMenu={handleDiscountMenu}
            />
          }
        />
        <Route path="/pemesanan" element={<Pemesanan cart={cart} />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/menu" element={<MenuAdmin />} />
        <Route path="/admin/order" element={<OrderAdmin />} />
        <Route path="/admin/reservation" element={<ReservationAdmin />} />
        <Route path="/admin/user" element={<UserAdmin />} />
      </Routes>
    </>
  );
}

export default App;
