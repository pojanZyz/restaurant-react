<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import "../css/login.css";
import logo from "../img/logo_restoran.png";
=======
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import "../css/login.css";
import logo from "../img/logo_restoran.png";
import useAuth from "../js/useAuth";
import Loader from "../components/Loader";
>>>>>>> 95b76e1 (Initial commit)

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState(false);
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("")
  const [role, setRole] = useState("")

  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Send login request to the API
    axios
      .post('https://cafemdn-api.vercel.app/api/login', { useremail, password })
      .then((res) => {
        setToken(res.data.accessToken);
        
        const decoded = jwtDecode(res.data.accessToken); // Decode the JWT token
        setRole(decoded.role);
  
        // Navigate based on role
=======
  const { token, userData, getToken } = useAuth();
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

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("api/login", { useremail, password })
      .then((res) => {
        const receivedToken = res.data.accessToken;
        const decoded = jwtDecode(receivedToken);
>>>>>>> 95b76e1 (Initial commit)
        if (decoded.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
<<<<<<< HEAD
  
        alert("Login successful");
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        alert(err.response.data.message);
        console.log(err.response.data.message);
=======

        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Login success! Welcome, ${decoded.username}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.message,
        });
        setUseremail("");
        setPassword("");
>>>>>>> 95b76e1 (Initial commit)
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main id="login-main" className="main-login">
<<<<<<< HEAD
      <section id="login-container" className="container-login">
        <div id="logo-wrapper" className="img">
          <img src={logo} alt="logo restoran" />
        </div>
        <div id="input-wrapper" className="inputBox">
          <h1>
            Login | <a href="/register">Register</a>
          </h1>
          <hr id="divider" />
          <div id="input-fields" className="input">
            <form onSubmit={handleLogin}>
              <div id="gmail-group" className="inpt">
                <input
                  className="login-input"
                  type="email"
                  id="gmail"
                  placeholder="G-mail"
                  required
                  value={useremail}
                  onChange={(e) => setUseremail(e.target.value)} // Bind state
                />
                <label htmlFor="gmail">
                  <i className="bi bi-person-fill"></i>
                </label>
              </div>
              <div id="password-group" className="inpt">
                <input
                  className="login-input"
                  type={inputType ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Bind state
                />
                <label htmlFor="password">
                  <i
                    className="bi bi-eye-slash-fill"
                    id="togglePassword"
                    onClick={() => setInputType(!inputType)}
                  ></i>
                </label>
              </div>

              <div id="remember-me" className="remember">
                <input type="checkbox" id="remember" />
                <span>Remember me</span>
              </div>

              <div id="button-group" className="btn">
                <button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
                <button type="reset">Reset</button>
              </div>
            </form>
          </div>
        </div>
      </section>
=======
      {loading ? (
        <Loader />
      ) : (
        <section id="login-container" className="container-login quicksand">
          <div className="conLogin-1">
            <Link to={"/"} className="linkLogin">
              <i class="bi bi-house-door-fill"></i>
            </Link>
            <img src={logo} alt="logo restoran" className="logoLogin" />
          </div>
          <div id="input-wrapper" className="inputBox">
            <h1 className="poppins-regular">Login</h1>
            <hr id="divider" />
            <form onSubmit={handleLogin}>
              <div className="input-con">
                <input
                  className="quicksand"
                  type="email"
                  placeholder="Email"
                  required
                  maxLength={30}
                  value={useremail}
                  onChange={(e) => setUseremail(e.target.value)}
                />
                <i className="bi bi-person-fill"></i>
              </div>
              <div className="input-con">
                <input
                  className="quicksand"
                  type={inputType ? "text" : "password"}
                  placeholder="Password"
                  required
                  maxLength={30}
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

              <span className="register-anc">
                Don't have an account? <a href="/register">Click here</a>
              </span>

              <button
                className="login-btn poppins-regular"
                type="submit"
                disabled={loading || !password || !useremail}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </section>
      )}
>>>>>>> 95b76e1 (Initial commit)
    </main>
  );
};

export default Login;
