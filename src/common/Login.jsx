import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import "../css/login.css";
import logo from "../img/logo_restoran.png";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState(false);
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
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
        if (decoded.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
  
        alert("Login successful");
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        alert(err.response.data.message);
        console.log(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main id="login-main" className="main-login">
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
    </main>
  );
};

export default Login;
