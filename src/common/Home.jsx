import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';

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
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination', // Ini untuk pagination
      clickable: true, // Menambahkan interaktivitas pada pagination
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'cube',  // Menggunakan efek cube untuk 3D
    cubeEffect: {
      shadow: true,   // Mengaktifkan bayangan pada cube
      slideShadows: true,  // Mengaktifkan bayangan slide
      shadowOffset: 20,   // Mengatur offset bayangan
      shadowScale: 0.94,  // Mengatur skala bayangan
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
      <div className="background-home"></div>
        <div className="main-home">
          {/* Home Section */}
          <div id="home" className="beranda">
      <div className="content-beranda">
        <motion.h1
          className="poppins-regular"
          initial={{ opacity: 0, y: -50 }} // Mulai dengan opacity 0 dan posisi di atas
          animate={{ opacity: 1, y: 0 }}    // Memudar dan bergerak ke posisi normal
          transition={{ duration: 1 }}      // Durasi animasi 1 detik
        >
          Welcome to Our Restaurant
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} // Mulai dengan opacity 0 dan sedikit turun
          animate={{ opacity: 1, y: 0 }}   // Memudar dan bergerak ke posisi normal
          transition={{ duration: 1, delay: 0.3 }} // Durasi animasi 1 detik dan delay 0.3 detik
        >
          Experience the best dishes with a touch of elegance.
        </motion.p>

        <motion.div
          className="order-menu"
          initial={{ opacity: 0, y: 30 }} // Mulai dengan opacity 0 dan sedikit turun
          animate={{ opacity: 1, y: 0 }}   // Memudar dan bergerak ke posisi normal
          transition={{ duration: 1, delay: 0.6 }} // Durasi animasi 1 detik dan delay 0.6 detik
        >
          <a href="/menu" className="poppins-regular">
            Order Now!!
          </a>
        </motion.div>
      </div>
    </div>

          {/*Penjelasan Cafe*/}
    <div className="desc-section">
      <motion.div
        className="desc-container-left"
        initial={{ x: -1000 }}  // Posisi awal di luar layar dari kiri
        animate={{ x: 0 }}      // Animasi untuk masuk ke posisi normal
        transition={{
          type: "spring",
          stiffness: 30,    // Lebih tinggi untuk pergerakan yang lebih kaku
          damping: 20,      // Damping sedikit lebih tinggi agar gerakan lebih mulus
          duration: 0.5,      // Durasi animasi 1 detik
          ease: "easeOut"   // Menambahkan ease untuk transisi yang lebih lembut
        }}
        whileInView={{ x: 0 }}  // Memastikan animasi berjalan saat elemen muncul di layar
        viewport={{ once: true }} // Menjalankan animasi hanya sekali saat elemen muncul
      >
        <div className="img-desc">
          <img
            src="https://tse4.mm.bing.net/th?id=OIP.nAEXIANViS1flGUYl1EOowAAAA&pid=Api&P=0&h=180"
            alt=""
          />
        </div>
        <div className="desc-content">
          <h2>John Doe</h2>
          <p className="main-desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut quasi,
            ad a accusamus quibusdam, exercitationem eligendi voluptatibus
            atque corporis possimus illum ratione, beatae aspernatur ducimus
            rem? Illum molestias ipsa aliquid a id quidem beatae rem autem
            inventore et, laborum iure quam doloribus quae nesciunt delectus
            distinctio dicta dolorum non explicabo.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="desc-container-right"
        initial={{ x: 1000 }}  // Posisi awal di luar layar dari kanan
        animate={{ x: 0 }}     // Animasi untuk masuk ke posisi normal
        transition={{
          type: "spring",
          stiffness: 30,       // Lebih tinggi untuk pergerakan yang lebih kaku
          damping: 20,         // Damping sedikit lebih tinggi agar gerakan lebih mulus
          duration: 0.5,         // Durasi animasi 1 detik
          ease: "easeOut"      // Menambahkan ease untuk transisi yang lebih lembut
        }}
        whileInView={{ x: 0 }}  // Memastikan animasi berjalan saat elemen muncul di layar
        viewport={{ once: true }} // Menjalankan animasi hanya sekali saat elemen muncul
      >
        <div className="desc-content">
          <h2>John Doe</h2>
          <p className="main-desc">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut quasi,
            ad a accusamus quibusdam, exercitationem eligendi voluptatibus
            atque corporis possimus illum ratione, beatae aspernatur ducimus
            rem? Illum molestias ipsa aliquid a id quidem beatae rem autem
            inventore et, laborum iure quam doloribus quae nesciunt delectus
            distinctio dicta dolorum non explicabo.
          </p>
        </div>
        <div className="img-desc">
          <img
            src="https://tse4.mm.bing.net/th?id=OIP.nAEXIANViS1flGUYl1EOowAAAA&pid=Api&P=0&h=180"
            alt=""
          />
        </div>
      </motion.div>
    </div>
          {/* Slider Section */}
          <div className="slider-section">
          <div className="promo-section">
            <div className="swiper">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <img
                    src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                    alt="Promo 1"
                    className="promo-image"
                  />
                  <div className="promo-content">
                    <h3>50% OFF on All Drinks</h3>
                    <p>Enjoy our refreshing beverages with a fantastic discount!</p>
                  </div>
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                    alt="Promo 2"
                    className="promo-image"
                  />
                  <div className="promo-content">
                    <h3>Buy 1 Get 1 Free</h3>
                    <p>Grab your favorite dish and get one more absolutely free!</p>
                  </div>
                </div>
                <div className="swiper-slide">
                  <img
                    src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                    alt="Promo 3"
                    className="promo-image"
                  />
                  <div className="promo-content">
                    <h3>Free Dessert on Orders Over $30</h3>
                    <p>Get a complimentary dessert with every purchase above $30.</p>
                  </div>
                </div>
              </div>
              <div className="swiper-pagination"></div>
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
            </div>
        </div>
      </div>

          {/* Best Seller Section */}
    <div className="best-seller">
      <h2 className="section-title poppins-regular">Best Sellers</h2>
      <div className="best-seller-container">
        <motion.div
          className="best-seller-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
            alt="Delicious Pizza"
            className="seller-image"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="seller-info">
            <h3>Delicious Pizza</h3>
            <p>A cheesy delight that melts in your mouth!</p>
            <div className="rating">
              <span className="star">&#9733;</span>
              <span className="star">&#9733;</span>
              <span className="star">&#9733;</span>
              <span className="star">&#9733;</span>
              <span className="star">&#9734;</span>
              <span className="rating-text">4.0 / 5</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="best-seller-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1551024506-0bccd828d307"
            alt="Chocolate Cake"
            className="seller-image"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="seller-info">
            <h3>Chocolate Cake</h3>
            <p>Rich and moist cake topped with velvety chocolate ganache.</p>
            <div className="rating">
              <span className="star">&#9733;</span>
              <span className="star">&#9733;</span>
              <span className="star">&#9733;</span>
              <span className="star">&#9733;</span>
              <span className="star">&#9733;</span>
              <span className="rating-text">5.0 / 5</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="best-seller-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"
            alt="Fresh Salad"
            className="seller-image"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="seller-info">
            <h3>Fresh Salad</h3>
            <p>Healthy and refreshing mix of greens and fruits.</p>
            <div className="rating">
              <span className="star">&#9733;</span>
              <span className="star">&#9733;</span>
              <span className="star">&#9733;</span>
              <span className="star">&#9734;</span>
              <span className="star">&#9734;</span>
              <span className="rating-text">3.0 / 5</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>


          {/* Location Section */}
          <div className="location-section">
            <h2 className="section-title poppins-regular">Find Us Here</h2>
            <div className="location-container">
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
                <div className="location-desc">
                  <div className="location-logo street">
                  <i class="bi bi-geo-alt-fill"></i>
                    <p>JL. Budi Luhur Gg.Buntu 1 No.6-A</p>
                  </div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur dolorem totam alias nobis? Dolore cum veritatis atque dignissimos quis nam velit eos sapiente quod, saepe, quisquam neque doloremque beatae aut.</p>
                  <div className="location-social">
                    <div className="location-logo">
                    <i class="bi bi-telephone-fill"></i>
                      <p>+62838016597151</p>
                    </div>
                    <div className="location-logo">
                    <i class="bi bi-envelope-fill"></i>
                      <p>admincafe@test.com</p>
                    </div>
                  </div>
                </div>
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
                  <ul className="contact-social-links">
                    <li><a href="https://www.facebook.com"><i class="bi bi-facebook"></i></a></li>
                    <li><a href="https://www.instagram.com"><i class="bi bi-instagram"></i></a></li>
                    <li><a href="https://www.twitter.com"><i class="bi bi-twitter-x"></i></a></li>
                  </ul>
              </div>
            <div className="footer-short-desc">
              <p>
              "Selamat datang di cafecoding , tempat menikmati hidangan lezat, kopi berkualitas, dan suasana hangat. Nikmati pengalaman terbaik bersama kami!"
              </p>
              </div>

              <div className="footer-open-schedule">
                <ul>
                  <li className="open-head"><i class="bi bi-calendar-check-fill"></i><span>Open At :</span></li>
                  <li>Senin: 08:00 - 22:00</li>
                  <li>Selasa: 08:00 - 22:00</li>
                  <li>Rabu: 08:00 - 22:00</li>
                  <li>Kamis: 08:00 - 22:00</li>
                  <li>Jumat - Minggu: 09:00 - 23:00</li>
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