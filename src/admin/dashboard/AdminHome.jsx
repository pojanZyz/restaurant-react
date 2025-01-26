import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../js/useAuth";

import InfoCard from "../../components/InfoCard";

const AdminHome = () => {
  const { token, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [datasCount, setDatasCount] = useState({});

  useEffect(() => {
    setLoading(true);
    axios
      .get("api/all-data-count")
      .then((res) => {
        setDatasCount(res.data);
      })
      .catch((err) => {
        console.log("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="body-box">
      <div className="admin-menu-container quicksand">
        <div className="admin-menu-con1">
          <h2 className="poppins-regular">
            Welcome, {userData?.username || ""}
          </h2>
        </div>
        <div className="admin-menu-con2">
          <div className="all-counts-grid">
            <InfoCard
              img="bi bi-cart-fill"
              num={datasCount.productCount}
              str={"Products"}
            />
            <InfoCard
              img="bi bi-person-fill"
              num={datasCount.userCount}
              str={"Users"}
            />
            <InfoCard
              img="bi bi-bag-check-fill"
              num={datasCount.orderCount}
              str={"Orders"}
            />
            <InfoCard
              img="bi bi-calendar-check"
              num={datasCount.reservationCount}
              str={"Reservations"}
            />
            <InfoCard
              img="bi bi-table"
              num={datasCount.tableCount}
              str={"Tables"}
            />
            <InfoCard
              img="bi bi-chat-left-dots-fill"
              num={datasCount.commentCount}
              str={"Comments"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
