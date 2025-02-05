import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import logo from "../img/logo_restoran.png";
import pic2 from "../img/pic2.png";
import "../css/home.css";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    new Swiper(".swiper", {
      modules: [Navigation, Pagination, Autoplay],
      direction: "horizontal",
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      effect: "cube",
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94,
      },
    });
  }, []);

  useEffect(() => {
    fetchProdStats();
  }, []);
  useEffect(() => {
    fetchComments();
  }, []);

  //get best selling products
  const fetchProdStats = async () => {
    try {
      const res = await axios.get("api/product-stats");
      setBestSellingProducts(res.data.bestSellings);
    } catch (error) {
      console.error("Failed to fetch best-selling products:", error);
    }
  };

  //get all comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(`api/comment?&status=Public`);
      setComments(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>CafeCoding</title>
      </Helmet>
      <div className="body-box">
        <div className="main-home quicksand">
          {/* Home Section */}
          <div className="content-beranda">
            <motion.img
              src={logo}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3 }}
            ></motion.img>
            <motion.h1
              className="agu-display"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              CafeCoding
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Feel the authenticness of real dining
            </motion.p>
            <motion.div
              className="order-menu"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <a href="/menu" className="poppins-regular">
                Order Now!!
              </a>
            </motion.div>
          </div>

          <div className="sect-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#a36303"
                fillOpacity="0.9"
                d="M0,288L360,32L720,160L1080,128L1440,320L1440,0L1080,0L720,0L360,0L0,0Z"
              ></path>
            </svg>
            <div className="text-img">
              <div className="left-side">
                <h1 className="poppins-regular">Since 1998</h1>
                <p>
                  We serve our customers to feel real dining and top quality
                  menu. Only in CafeCoding like no other. Join us!
                </p>
                <ul>
                  <li>☕ 100% from real coffee beans</li>
                  <li>✅ Certified Halal</li>
                </ul>
                <NavLink to={"/register"}>
                  <button className="poppins-regular">JOIN MEMBER</button>
                </NavLink>
              </div>
              <div className="right-side">
                <img src={pic2} loading="lazy" />
              </div>
            </div>
          </div>

          <div className="sect-3">
            <h3 className="poppins-regular">✨Best Seller🔝</h3>
            <div className="best-item-grid">
              <span className="no1-lbl">#1</span>
              <img
                src={bestSellingProducts[0]?.productImagePath}
                alt={bestSellingProducts[0]?.productName}
              />
              <h5 className="poppins-regular">
                {bestSellingProducts[0]?.productName}
              </h5>
              <span>
                Rp{bestSellingProducts[0]?.productPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="best-grid">
              {bestSellingProducts?.slice(1, 5).map((product) => (
                <div className="best-item-grid" key={product._id}>
                  <img
                    src={product.productImagePath}
                    alt={product.productName}
                  />
                  <h5 className="poppins-regular">{product.productName}</h5>
                  <span>Rp{product.productPrice.toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>
            <NavLink to={"/menu"}>
              <button className="poppins-regular">See more</button>
            </NavLink>
          </div>

          <div className="sect-4">
            <h3 className="poppins-regular">
              <i class="bi bi-chat-left-heart"></i>
              <span> What people think about CafeCoding</span>
            </h3>
            <div className="com-grid">
              {comments.map((comment) => (
                <div className="com-grid-item">
                  <div className="header">
                    <i class="bi bi-person-square"></i>
                    <div>
                      <span className="poppins-regular">
                        {comment?.userInfo?.username}
                      </span>
                      <span>{comment?.userInfo?.useremail}</span>
                    </div>
                  </div>
                  <p>{comment.comment}</p>
                </div>
              ))}
            </div>
            <div className="footer">
              <p>
                Have some advices, suggestions, comments or more? Give us your
                feedback!
              </p>
              <NavLink to={"/feedback"}>
                <button className="poppins-regular">Feedback</button>
              </NavLink>
            </div>
          </div>

          <div className="sect-5">
            <div className="location-section">
              <h2 className="section-title poppins-regular">Find Us Here</h2>
              <div className="location-container">
                <iframe
                  title="Cafe Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345094647!2d144.95512381531857!3d-37.81720997975127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577f3a570e8e3bf!2sRestaurant!5e0!3m2!1sen!2sid!4v1670823027979!5m2!1sen!2sid"
                  width=""
                  height=""
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="location-desc">
                  <div className="location-logo">
                    <i className="bi bi-geo-alt-fill"></i>
                    <p>JL. Budi Luhur Gg.Buntu 1 No.6-A</p>
                  </div>
                  <div className="location-logo">
                    <i className="bi bi-telephone-fill"></i>
                    <p> +62838016597151</p>
                  </div>
                  <div className="location-logo">
                    <i className="bi bi-envelope-fill"></i>{" "}
                    <p> admincafe@test.com</p>
                  </div>
                  <ul>
                    <li>
                      <i className="bi bi-calendar-check-fill"></i>
                      <span className="poppins-regular"> Open At :</span>
                    </li>
                    <li>Senin: 08:00 - 22:00</li>
                    <li>Selasa: 08:00 - 22:00</li>
                    <li>Rabu: 08:00 - 22:00</li>
                    <li>Kamis: 08:00 - 22:00</li>
                    <li>Jumat - Minggu: 09:00 - 23:00</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
