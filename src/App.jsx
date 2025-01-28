import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "./components/sidebar/Sidebar";
import AdminSidebar from "./components/sidebar/AdminSidebar"
import ProtectedRoute from "./ProtectedRoute";
import Footer from "./components/Footer";

import "./css/app.css"

import Register from "./common/Register";
import Login from "./common/Login";
import Home from "./common/Home";
import Menu from "./common/Menu";
import Order from "./common/Order";
import Reservation from "./common/Reservation";
import Loyalty from "./common/loyalty/Loyalty";
import Feedback from "./common/Feedback";

import AdminHome from "./admin/dashboard/AdminHome";
import MenuAdmin from "./admin/products/MenuAdmin";
import ReservationAdmin from "./admin/reservations/ReservationAdmin";
import OrderAdmin from "./admin/orders/OrderAdmin";
import UserAdmin from "./admin/users/UserAdmin";
import TableAdmin from "./admin/tables/TableAdmin";
import CommentAdmin from "./admin/comments/CommentAdmin";
import CashierNavbar from "./components/CashierNavbar";
import Cashier from "./cashier/Cashier";
import OrdHistory from "./cashier/OrdHistory";
import PaymentResult from "./common/PaymentResult";
import CasReservation from "./cashier/CasReservation";
import DiscountAdmin from "./admin/discounts/DiscountAdmin";
import useAuth from "./js/useAuth";

function App() {
  const location = useLocation();
  const {token, tokenLoading, userData} = useAuth()
  const hideSidebar = ["/login", "/register", "/payment-result"];

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
    return <Sidebar />;
  };

  const renderFooter = () => {
    if (hideSidebar.includes(location.pathname)) {
      return null;
    }
    if (location.pathname.startsWith("/cashier")) {
      return "";
    }
    if (location.pathname.startsWith("/payment-result")) {
      return <Footer from={"cashier"} />;
    }
    return <Footer from={""} />;
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
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/loyalty" element={<Loyalty />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/menu" element={<MenuAdmin />} />
          <Route path="/admin/order" element={<OrderAdmin />} />
          <Route path="/admin/discount" element={<DiscountAdmin />} />
          <Route path="/admin/reservation" element={<ReservationAdmin />} />
          <Route path="/admin/user" element={<UserAdmin />} />
          <Route path="/admin/table" element={<TableAdmin />} />
          <Route path="/admin/comment" element={<CommentAdmin />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="cashier" />}>
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/cashier/history" element={<OrdHistory />} />
          <Route path="/cashier/reservation" element={<CasReservation />} />
        </Route>
      </Routes>
      {renderFooter()}
    </>
  );
}

export default App;