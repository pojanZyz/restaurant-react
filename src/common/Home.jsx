import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import React, { useState, useEffect } from "react";

import "../css/app.css";
import "../css/home.css";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Initialize Swiper when the component is mounted
  useEffect(() => {
    new Swiper('.swiper', {
      modules: [Navigation, Pagination, Autoplay],
      direction: 'horizontal',
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }, []); // Empty dependency array to run only once when component mounts

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="body-box">
      <div className="container-box quicksand">
        {/* Main Content */}
        <div className="main-home">
          {/* Home Section */}
          <div id="home" className="beranda">
            <div className="content-beranda">
              <h1 className="poppins-regular">Welcome to Our Restaurant</h1>
              <p>Experience the best dishes with a touch of elegance.</p>
              <div className="order-menu">
                <a href="/menu" className="poppins-regular">
                  Order Now!!
                </a>
              </div>
            </div>
          </div>

          {/* Slider Section */}
          <div className="slider-section">
            <div className="swiper">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <img
                    src="https://wallpaperaccess.com/full/2632487.jpg"
                    alt="Slide 1"
                    className="slider-image"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://wallpaperaccess.com/full/2632487.jpg"
                    alt="Slide 2"
                    className="slider-image"
                  />
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://wallpaperaccess.com/full/2632487.jpg"
                    alt="Slide 3"
                    className="slider-image"
                  />
                </div>
              </div>
              <div className="swiper-pagination"></div>
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
            </div>
          </div>

          {/* Best Seller Section */}
          <div className="best-seller">
            <h2 className="section-title poppins-regular">Best Sellers</h2>
            <div className="best-seller-container">
              <div className="best-seller-item">
                <img
                  src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                  alt="Delicious Pizza"
                  className="seller-image"
                />
                <div className="seller-info">
                  <h3>Delicious Pizza</h3>
                  <p>A cheesy delight that melts in your mouth!</p>
                </div>
              </div>
              <div className="best-seller-item">
                <img
                  src="https://images.unsplash.com/photo-1551024506-0bccd828d307"
                  alt="Chocolate Cake"
                  className="seller-image"
                />
                <div className="seller-info">
                  <h3>Chocolate Cake</h3>
                  <p>Rich and moist cake topped with velvety chocolate ganache.</p>
                </div>
              </div>
              <div className="best-seller-item">
                <img
                  src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
                  alt="Fresh Salad"
                  className="seller-image"
                />
                <div className="seller-info">
                  <h3>Fresh Salad</h3>
                  <p>Healthy and refreshing mix of greens and fruits.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="location-section">
            <h2 className="section-title poppins-regular">Find Us Here</h2>
            <div className="map-container">
              <iframe
                title="Cafe Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345094647!2d144.95512381531857!3d-37.81720997975127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577f3a570e8e3bf!2sRestaurant!5e0!3m2!1sen!2sid!4v1670823027979!5m2!1sen!2sid"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Footer Section */}
          <footer className="footer">
            <div className="footer-container">
              <div className="footer-contact">
                <h3>Contact Us</h3>
                <p>Email: cafe@example.com</p>
                <p>Phone: +62 812-3456-7890</p>
                <p>Address: 123 Main Street, Jakarta</p>
              </div>
              <div className="footer-social">
                <h3>Follow Us</h3>
                <ul className="social-links">
                  <li><a href="https://www.facebook.com">Facebook</a></li>
                  <li><a href="https://www.instagram.com">Instagram</a></li>
                  <li><a href="https://www.twitter.com">Twitter</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 Cafe Restaurant. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
