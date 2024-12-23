import React from "react";
import "../css/app.css";
import "../css/home.css";

const Dashboard = () => {
  return (
    <div className="body-box">
      <div className="restaurant-wrapper">
        <div className="restaurant-container">
          <header className="home-header">
            <h1 className="home-title">Le Ciel Fine Dining</h1>
            <nav className="home-navbar">
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#menu">Menu</a>
                </li>
                <li>
                  <a href="#special">Specials</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </nav>
          </header>

          <section className="home-hero-section">
            <div className="home-hero-content">
              <h2>Indulge in the Art of Fine Dining</h2>
              <p>
                Discover the ultimate luxury dining experience with our signature
                dishes.
              </p>
              <button className="home-hero-cta-btn">Reserve Your Table</button>
            </div>
          </section>

          <section id="menu" className="home-menu-section">
            <h3 className="home-menu-title">Our Signature Dishes</h3>
            <p className="home-menu-subtitle">Menu Unggulan</p>
            <div className="home-menu-items">
              <div className="home-menu-item">
                <img
                  src="https://www.example.com/path_to_luxury_dish_1.jpg"
                  alt="Truffle Risotto"
                  className="home-menu-item-img"
                />
                <h4>Truffle Risotto</h4>
                <p>A decadent blend of earthy truffles and creamy rice.</p>
              </div>
              <div className="home-menu-item">
                <img
                  src="https://www.example.com/path_to_luxury_dish_2.jpg"
                  alt="Lobster Tail"
                  className="home-menu-item-img"
                />
                <h4>Lobster Tail</h4>
                <p>Sautéed lobster tail with a citrus butter sauce.</p>
              </div>
              <div className="home-menu-item">
                <img
                  src="https://www.example.com/path_to_luxury_dish_3.jpg"
                  alt="Chocolate Fondant"
                  className="home-menu-item-img"
                />
                <h4>Chocolate Fondant</h4>
                <p>Rich molten chocolate with a touch of vanilla bean.</p>
              </div>
            </div>
          </section>

          <section id="special" className="home-special-section">
            <h3 className="home-special-title">Meet Our Founder</h3>
            <div className="home-special-content">
              <div className="home-founder">
                <img
                  src="https://media.istockphoto.com/id/1457561088/pt/foto/alien-showing-peace-sign-3d-render.jpg?s=170667a&w=0&k=20&c=Ml-52WpBxlcLsq9nwJ1DNRrq5GCuNr_V6fSD7_JgMi0="
                  alt="Founder"
                  className="home-founder-img"
                />
                <p>
                  Our visionary founder, Chef Laurent, brings decades of culinary
                  excellence to create unforgettable dining experiences.
                </p>
              </div>
              <div className="home-cookie">
                <img
                  src="https://tse3.mm.bing.net/th?id=OIP.Xi_b79nkiJjDFU0QSGWSYwHaHa&pid=Api&P=0&h=180"
                  alt="Signature Cookie"
                  className="home-cookie-img"
                />
                <p>
                  Don’t miss our signature dessert: the Le Ciel Cookie — a
                  masterpiece of flavor and texture.
                </p>
              </div>
            </div>
          </section>

          <section id="location" className="home-map-section">
            <h3 className="home-map-title">Visit Us</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509364!2d-122.41941568468153!3d37.77492977975927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808f74e08b5f%3A0x813c8c63ed28dd09!2sFine+Dining+Restaurant!5e0!3m2!1sen!2sus!4v1614710209256!5m2!1sen!2sus"
              width="600"
              height="450"
              style={{ border: 0, borderRadius: "15px" }}
              allowFullScreen=""
              loading="lazy"
              title="Location Map"
            ></iframe>
          </section>

          <footer className="home-footer">
            <p>
              &copy; 2024 Le Ciel Fine Dining. Designed with elegance and luxury.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
