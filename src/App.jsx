import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import AdminSidebar from "./components/AdminSidebar"

import Register from "./common/Register";
import Login from "./common/Login";
import Home from "./common/Home";
import Menu from "./common/Menu";
import Order from "./common/Order";
import Reservation from "./common/Reservation";
import Loyalty from "./common/Loyalty";
import Feedback from "./common/Feedback";

import AdminHome from "./admin/AdminHome";
import MenuAdmin from "./admin/MenuAdmin";
import ReservationAdmin from "./admin/ReservationAdmin";
import OrderAdmin from "./admin/OrderAdmin";
import UserAdmin from "./admin/UserAdmin";
import TableAdmin from "./admin/TableAdmin";
import CommentAdmin from "./admin/CommentAdmin";
import CashierNavbar from "./components/CashierNavbar";
import Cashier from "./cashier/Cashier";
import OrdHistory from "./cashier/OrdHistory";

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

  const renderSidebar = () => {
    if (hideSidebar.includes(location.pathname)) {
      return null; 
    }
    if (location.pathname.startsWith("/admin")) {
      return <AdminSidebar />;
    }
    if(location.pathname.startsWith("/cashier")){
      return <CashierNavbar />
    }
    return <Sidebar />; // Sidebar umum untuk route lain
  };

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
  axios.defaults.baseURL = "https://cafemdn-api.vercel.app/"

  return (
    <>
      {renderSidebar()}
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
          path="/order"
          element={
            <Order
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
              handleIncrease={() => {}}
              handleDecrease={() => {}}
              handleDiscountMenu={() => {}}
            />
          }
        />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/feedback" element={<Feedback />} />
        
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/menu" element={<MenuAdmin />} />
        <Route path="/admin/order" element={<OrderAdmin />} />
        <Route path="/admin/reservation" element={<ReservationAdmin />} />
        <Route path="/admin/user" element={<UserAdmin />} />
        <Route path="/admin/table" element={<TableAdmin />} />
        <Route path="/admin/comment"  element={<CommentAdmin />}/>

        <Route path="/cashier" element={<Cashier />} />
        <Route path="/cashier/history" element={<OrdHistory />} />
      </Routes>
    </>
  );
}

export default App;