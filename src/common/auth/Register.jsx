import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import "./auth.css";
import logo from "../../img/logo_restoran.png";
import Loader from "../../components/Loader";
import useAuth from "../../js/useAuth";
import { Helmet } from "react-helmet";

const Register = () => {
  const { token, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState(true);
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      if (userData?.role === "admin") {
        navigate("/admin");
      } else if (userData?.role === "customer") {
        navigate("/");
      }
    }
  }, [token, userData, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("api/user", {
        username,
        useremail,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Account created, just need to login!",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });

      setPassword("");
      setUseremail("");
      setUsername("");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Helmet>
        <title>Register to CafeCoding</title>
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
          <form className="auth-form" onSubmit={handleRegister}>
            <h1 className="poppins-regular">Register</h1>
            <hr />
            <label htmlFor="username">Username</label>
            <div className="auth-input">
              <input
                className="quicksand"
                type="text"
                maxLength={20}
                required
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <i className="bi bi-person-fill"></i>
            </div>
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
              <p>Already have an account? </p>
              <NavLink to={"/login"}>Login</NavLink>
            </div>
            <div className="auth-footer">
              <button
                className="poppins-regular"
                type="submit"
                onSubmit={handleRegister}
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

export default Register;
