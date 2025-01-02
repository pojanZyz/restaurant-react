import React, { useEffect, useState } from "react";
import "../css/app.css";
import "../css/home.css";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
