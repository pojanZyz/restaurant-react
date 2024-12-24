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
    setLoading(true);

    axios
      .post("https://cafemdn-api.vercel.app/api/user", {
        username,
        useremail,
        password,
      })
      .then((res) => {
        setMessage(res.data.message);
        alert(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        alert(err.response.data.message);
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
                  className="login-input"
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
                  className="login-input"
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
                  className="login-input"
                  type="email"
                  id="gmail"
                  placeholder="G-mail"
                  required
                  value={useremail}
                  onChange={(e) => setUseremail(e.target.value)} // Bind state
                />
              </div>
              <div id="button-group" className="btn">
                <button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Register"}
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

export default Register;
