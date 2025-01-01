<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/register.css";
import logo from "../img/logo_restoran.png";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState(false);
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleRegister = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
=======
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../css/register.css";
import logo from "../img/logo_restoran.png";
import Loader from "../components/Loader";
import useAuth from "../js/useAuth";

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

  const handleRegister = (e) => {
    e.preventDefault();
>>>>>>> 95b76e1 (Initial commit)
    setLoading(true);

    axios
      .post("https://cafemdn-api.vercel.app/api/user", {
        username,
        useremail,
        password,
      })
      .then((res) => {
<<<<<<< HEAD
        setMessage(res.data.message);
        alert(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        alert(err.response.data.message);
=======
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Account created, just need to login!`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.message,
        });
>>>>>>> 95b76e1 (Initial commit)
        setPassword("");
        setUseremail("");
        setUsername("");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main id="regist-main" className="main-regist">
<<<<<<< HEAD
      <section id="regist-container" className="container-regist">
        <div id="logo-wrapper" className="img">
          <img src={logo} alt="logo restoran" />
        </div>
        <div id="input-wrapper" className="inputBox">
          <h1>
            <a href="/login">Login</a> | Register
          </h1>
          <hr id="divider" />
          <div id="input-fields" className="input-regist">
            <form onSubmit={handleRegister}>
              <div id="username-group" className="inpt">
                <input
                  className="regist-input"
                  type="text"
                  id="username"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Bind state
                />
                <label htmlFor="username">
                  <i className="bi bi-person-fill"></i>
                </label>
              </div>

              <div id="password-group" className="inpt">
                <input
                  className="regist-input"
                  type={inputType ? "password" : "text"}
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
              <div id="gmail-group" className="inpt">
                <input
                  className="regist-input"
                  type="email"
                  id="gmail"
                  placeholder="G-mail"
                  required
                  value={useremail}
                  onChange={(e) => setUseremail(e.target.value)} // Bind state
                />
              </div>
              <div id="btn-group" className="btn">
                <button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Register"}
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
        <section id="regist-container" className="container-regist quicksand">
          <div className="conRegis-1">
            <Link to={"/"}>
              <i className="bi bi-house-door-fill"></i>
            </Link>
            <img src={logo} alt="logo restoran" className="logoRegis" />
          </div>
          <div id="input-wrapper" className="inputBox-regist">
            <h1 className="poppins-regular">Register</h1>
            <hr id="divider" />
            <form onSubmit={handleRegister}>
              <div className="input-con-regist">
                <input
                  className="quicksand"
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={20}
                />
                <i className="bi bi-person-fill"></i>
              </div>
              <div className="input-con-regist">
                <input
                  className="quicksand"
                  type="email"
                  placeholder="G-mail"
                  required
                  value={useremail}
                  onChange={(e) => setUseremail(e.target.value)}
                  maxLength={35}
                />
                <i className="bi bi-envelope-fill"></i>
              </div>
              <div className="input-con-regist">
                <input
                  className="quicksand"
                  type={inputType ? "password" : "text"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={15}
                />
                <i
                  className={
                    inputType ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
                  }
                  onClick={() => setInputType(!inputType)}
                ></i>
              </div>

              <span className="register-anc">
                <h6>Already have an account? <a href="/login">Click here</a></h6>
              </span>

              <button
                type="submit"
                className="regis-btn poppins-regular"
                disabled={loading || !password || !useremail || !username}
              >
                {loading ? "Loading..." : "Register"}
              </button>
            </form>
          </div>
        </section>
      )}
>>>>>>> 95b76e1 (Initial commit)
    </main>
  );
};

export default Register;
