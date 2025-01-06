import React, { useState } from "react";

import useAuth from "../js/useAuth";
import Loader from "../components/Loader";
import "../css/loyalty.css";
import axios from "axios";

const Loyalty = () => {
  const { token, userData, tokenLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({})

  const fetchUserAcc = async () => {
    setLoading(false)
    try {
      if(!tokenLoading){
        const res = await axios.get(`api/user/${userData.userId}`)

        setUser(res.data.data)
      }
    } catch (error) {
      console.error(error)
    } finally{
      setLoading(false)
    }
  }
  return (
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="loyalty-container quicksand">
        <div className="loy-con1">
          <h2 className="poppins-regular">
            <i className="bi bi-person-hearts"></i> Loyalty
          </h2>
          <div className="profile-box">
            <span>{userData?.useremail || "Loading.."}</span>
            <i className="bi bi-person-circle"></i>
          </div>
        </div>

        <div className="loy-con2">
          <div className="item-loy-con2 cc-pts">
            <i className="bi bi-coin"></i>
            <div>
              <p className="poppins-regular">Your CCPoints</p>
              <span>
                <h3>0</h3>
                <sub>pts</sub>
              </span>
            </div>
          </div>
          <div className="item-loy-con2 res-made">
            <i className="bi bi-bag-check-fill"></i>
            <div>
              <p className="poppins-regular">Reservation Made</p>
              <span>
                <h3>0</h3>
                <sub>res</sub>
              </span>
            </div>
          </div>
          <div className="item-loy-con2 ord-made">
            <i className="bi bi-calculator"></i>
            <div>
              <p className="poppins-regular">Order Made</p>
              <span>
                <h3>0</h3>
                <sub>ord</sub>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
