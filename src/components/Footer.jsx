import React from "react";

import logo from "../img/logo_restoran.png";

const Footer = ({from}) => {
  return (
    <div className={`${from === "cashier" ? "" : "body-box" }`}>
      <div className="footer-con quicksand">
        <div className="left-side">
          <img src={logo} loading="lazy" />
          <h5 className="agu-display">CafeCoding</h5>
          <p></p>
        </div>
        <div className="center-line"></div>
        <div className="right-side">
          <div className="social-item">
            <i className="bi bi-facebook"></i>
            <span className="social-name">CafeCoding</span>
          </div>
          <div className="social-item">
            <i className="bi bi-instagram"></i>
            <span className="social-name">cafecoding</span>
          </div>
          <div className="social-item">
            <i className="bi bi-twitter"></i>
            <span className="social-name">cafecoding</span>
          </div>
          <div className="social-item">
            <i className="bi bi-linkedin"></i>
            <span className="social-name">CafeCoding</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
