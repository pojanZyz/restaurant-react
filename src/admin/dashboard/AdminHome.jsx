import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import useAuth from "../../js/useAuth";
import InfoCard from "../../components/InfoCard";
import Revenue from "../../cashier/Revenue";
import Loader from "../../components/Loader";

const AdminHome = () => {
  const { token, userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const [datasCount, setDatasCount] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [filter, setFilter] = useState("daily");


  const formatFee = (value) => {
    if (value >= 1000000) {
      return `Rp${(value / 1000000).toFixed(1)}jt`;
    } else if (value >= 1000) {
      return `Rp${(value / 1000).toFixed(1)}k`;
    }
    return `Rp${value.toLocaleString()}`;
  };

  //all data counts
  const fetchCounts = async () => {
    try {
      const res = await axios.get("api/all-data-count");
      setDatasCount(res.data);
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };

  //rev over time
  const fetchRevenueData = async (filter) => {
    try {
      setLoading(true)
      const res = await axios.get(`api/total-revenue?filter=${filter}`);
      setRevenueData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch revenue data", err);
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchRevenueData(filter);
  }, [filter]);

  //line chart
  const chartData = {
    labels: revenueData.map((item) => item.date),
    datasets: [
      {
        label: "Total Revenue",
        data: revenueData.map((item) => item.revenue),
        fill: true,
        backgroundColor: "rgba(2, 255, 255, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.2,
      },
    ],
  };
   const chartOptions = {
     responsive: true,
     plugins: {
       legend: {
         display: true,
         position: "top",
         labels: {
           font: { family: "Poppins", size: 12 },
           color: "black",
         },
       },
     },
     scales: {
       x: {
         title: {
           display: true,
           text: "Date",
           font: { family: "Poppins", size: 12, weight: "bold" },
           color: "black",
         },
       },
       y: {
         title: {
           display: true,
           text: "Total Revenue",
           font: { family: "Poppins", size: 12, weight: "bold" },
           color: "black",
         },
         ticks: {
           callback: (value) => formatFee(value),
         },
       },
     },
   };

  return (
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
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
          <Revenue />
        </div>

        <div className="admin-home-con3">
          <div className="line-wrap">
            <h4 className="poppins-regular">Revenue Over Time</h4>
            <div className="filter-buttons">
              <button
                className={`filter-btn poppins-regular ${
                  filter === "daily" ? "active" : ""
                }`}
                onClick={() => setFilter("daily")}
              >
                Daily
              </button>
              <button
                className={`filter-btn poppins-regular ${
                  filter === "monthly" ? "active" : ""
                }`}
                onClick={() => setFilter("monthly")}
              >
                Monthly
              </button>
              <button
                className={`filter-btn poppins-regular ${
                  filter === "yearly" ? "active" : ""
                }`}
                onClick={() => setFilter("yearly")}
              >
                Yearly
              </button>
            </div>
            <div className="line-chart">
              <Line data={chartData} options={chartOptions} height={100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
