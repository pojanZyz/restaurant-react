// import {Routes, Route} from "react-router-dom"
// import Menu from './menu-digital/menu'
// import Sidebar from './components/Sidebar'
// import Payment from "./payment/Payment"
// import Pemesanan from "./pemesanan/Pemesanan"
// import Login from "./login/login"
// import Register from "./login/Register"
// import Feedback from "./feedback/Feedback"
// import Dashboard from "./dashboard/Dashboard"

// function App() {

//   return (
//     <>
//     <Sidebar />
//     <Routes>
//       <Route path='/' element={<Menu />} />
//       <Route path="/payment" element={<Payment />} />
//       <Route path="/pemesanan" element={<Pemesanan />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/feedback" element={<Feedback />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//     </Routes>
//     </>
//   )
// }

// export default App


import React, { useEffect, useState } from "react";  
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Menu from './common/Menu';
import Sidebar from './components/Sidebar';
import Payment from "./common/Payment";
import Pemesanan from "./common/Pemesanan";
import Login from "./common/Login";
import Register from "./common/Register";
import Feedback from "./common/Feedback";
import Home from "./common/Home";

import AdminHome from "./admin/AdminHome";
import MenuAdmin from "./admin/MenuAdmin";
import ReservationAdmin from "./admin/ReservationAdmin";
import OrderAdmin from "./admin/OrderAdmin";
import UserAdmin from "./admin/UserAdmin";


function App() {
  const location = useLocation()
  const [cart, setCart] = useState([]);
  const hideSidebar = ['/login', '/register']

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  axios.defaults.withCredentials = true
  return (
    <>
      {!hideSidebar.includes(location.pathname) && <Sidebar />}
      <Routes>
        <Route path="/" element={<Home />} />  {/*home (halaman pertama) */}
        <Route path="/register" element={<Register />} />  {/* register */}
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu addToCart={addToCart} />} />  {/*menu*/}
        <Route path="/payment" element={<Payment cart={cart} />} />{/*pembayaran*/}
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
