import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./js/useAuth";
import Loader from "./components/Loader";

const ProtectedRoute = ({ requiredRole }) => {
  const { userData, tokenLoading } = useAuth();

  if (tokenLoading) {
    return <Loader />; // Bisa diganti dengan animasi loading
  }

  if (!userData) {
    // Redirect ke halaman login jika user belum login
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userData.role !== requiredRole) {
    // Redirect ke halaman unauthorized jika role tidak sesuai
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
