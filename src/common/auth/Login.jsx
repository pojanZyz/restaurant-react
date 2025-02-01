import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import logo from "../../img/logo_restoran.png";
import useAuth from "../../js/useAuth";
import Loader from "../../components/Loader";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState(true);
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const { token, userData, getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      if (userData?.role === "admin") {
        navigate("/admin");
      } else if (userData?.role === "customer") {
        navigate("/");
      } else if (userData?.role === "cashier") {
        navigate("/cashier");
      }
    }
  }, [token, userData, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("api/login", { useremail, password });

      const receivedToken = res.data.accessToken;
      const decoded = jwtDecode(receivedToken);

      if (decoded.role === "admin") {
        navigate("/admin");
      } else if (decoded.role === "cashier") {
        navigate("/cashier");
      } else {
        navigate("/");
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Login success! Welcome, ${decoded.username}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });

      setUseremail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Helmet>
        <title>Login to CafeCoding</title>
      </Helmet>
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="auth-container quicksand">
        <div className="auth-form-wrap">
          <NavLink className="home-btn" to={"/"}>
            <i className="bi bi-house-door-fill"></i>
          </NavLink>
          <div className="logo-wrapper">
            <img src={logo} alt="logo" loading="lazy" />
          </div>
          <form className="auth-form" onSubmit={handleLogin}>
            <h1 className="poppins-regular">Login</h1>
            <hr />
            <label htmlFor="useremail">Email</label>
            <div className="auth-input">
              <input
                className="quicksand"
                type="email"
                maxLength={35}
                required
                placeholder="Email"
                value={useremail}
                onChange={(e) => setUseremail(e.target.value)}
              />
              <i className="bi bi-envelope-fill"></i>
            </div>
            <label htmlFor="password">Password</label>
            <div className="auth-input">
              <input
                className="quicksand"
                type={inputType ? "password" : "text"}
                maxLength={20}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={
                  inputType ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
                }
                onClick={() => setInputType(!inputType)}
              ></i>
            </div>
            <div className="nav-auth">
              <p>Don't have an account? </p>
              <NavLink to={"/register"}>Register</NavLink>
            </div>
            <div className="auth-footer">
              <button
                className="poppins-regular"
                type="submit"
                onSubmit={handleLogin}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
