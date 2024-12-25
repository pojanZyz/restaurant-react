import React, { useEffect, useState } from "react"; 
import "../css/app.css";
import "../css/home.css";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return(
    <div className="body-box">
      <div className="container-box quicksand">
        {/* Navbar */}
        

        {/* Main Content */}
        <div className="main-home">
          {/* Home Section */}
          <div id="home" className="beranda">
            <div className="content-beranda">
              <h1 className="poppins-regular">Welcome to Our Restaurant</h1>
              <p>Experience the best dishes with a touch of elegance.</p>
              <div className="order-menu">
                <a href="/menu" className="poppins-regular">Order Now!!</a>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div id="about" className="section about">
            <h2>About Us</h2>
            <p>
              We are committed to providing high-quality food and exceptional service. Our chefs use fresh ingredients to create a memorable dining experience.
            </p>
          </div>

          {/* Best Seller Section */}
          <div id="best-seller" className="section best-seller">
            <h2>Best Sellers</h2>
            <div className="menu-list">
              <div className="menu-item">
                <h3>Signature Steak</h3>
                <p>Juicy and tender steak grilled to perfection.</p>
              </div>
              <div className="menu-item">
                <h3>Seafood Platter</h3>
                <p>A delightful mix of fresh seafood with our special sauce.</p>
              </div>
              <div className="menu-item">
                <h3>Classic Cheesecake</h3>
                <p>Rich and creamy cheesecake with a buttery crust.</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div id="contact" className="section contact">
            <h2>Contact Us</h2>
            <p>Have any questions or want to make a reservation? Reach out to us!</p>
            <div className="contact-info">
              <p>Email: info@restaurant.com</p>
              <p>Phone: +123 456 7890</p>
              <p>Address: 123 Culinary Street, Food City</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
