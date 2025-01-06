import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import "../css/login.css";
import logo from "../img/logo_restoran.png";
import useAuth from "../js/useAuth";
import Loader from "../components/Loader";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState(false);
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
        if (decoded.role === "admin") {
          navigate("/admin");
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
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.response.data.message,
        });
        setUseremail("");
        setPassword("");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main id="login-main" className="main-login">
      {loading ? (
        <Loader />
      ) : (
        <section id="login-container" className="container-login quicksand">
          <div className="conLogin-1">
            <Link to={"/"}>
              <i className="bi bi-house-door-fill"></i>
            </Link>
            <img src={logo} alt="logo restoran" className="logo" />
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
    </main>
  );
};

export default Login;
