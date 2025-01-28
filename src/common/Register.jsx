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
    setLoading(true);

    axios
      .post("https://cafemdn-api.vercel.app/api/user", {
        username,
        useremail,
        password,
      })
      .then((res) => {
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
      {loading ? (
        <Loader />
      ) : (
        <section id="regist-container" className="container-regist quicksand">
          <div className="conRegis-1">
            <Link to={"/"}>
              <i className="bi bi-house-door-fill"></i>
            </Link>
            <img src={logo} alt="logo restoran" className="logo" />
          </div>
          <div id="input-wrapper" className="inputBox">
            <h1 className="poppins-regular">Register</h1>
            <hr id="divider" />
            <form onSubmit={handleRegister}>
              <div className="input-con">
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
              <div className="input-con">
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
              <div className="input-con">
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
                Already have an account? <a href="/login">Login</a>
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
    </main>
  );
};

export default Register;
