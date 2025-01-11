import React from "react";

import "../admin-css/history.css";
import { NavLink } from "react-router-dom";

const OrdHistory = () => {
  return (
    <div className="ordhis-container">
      <div className="ordhis-wrap">
        <h3 className="poppins-regular">
          <i className="bi bi-journal-text"></i> History
        </h3>

        <div className="histories-wrap">
          <NavLink to={"/cashier/history/order"}>
            <div className="histories">
              <div>
                <h5 className="poppins-regular">Orders</h5>
                <p className="quicksand">
                  See all order history from cashier and online.
                </p>
              </div>
              <i className="bi bi-chevron-right"></i>
            </div>
          </NavLink>

          <NavLink to={"/cashier/history/table"}>
            <div className="histories">
              <div>
                <h5 className="poppins-regular">Tables</h5>
                <p className="quicksand">
                  See and change table status for today
                </p>
              </div>
              <i className="bi bi-chevron-right"></i>
            </div>
          </NavLink>

          <NavLink to={"/cashier/history/reservation"}>
            <div className="histories">
              <div>
                <h5 className="poppins-regular">Reservations</h5>
                <p className="quicksand">
                  See all reservation history from cashier and online
                </p>
              </div>
              <i className="bi bi-chevron-right"></i>
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default OrdHistory;
