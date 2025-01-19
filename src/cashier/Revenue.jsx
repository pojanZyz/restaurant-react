import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Revenue = () => {
  const [revenueData, setRevenueData] = useState({
    total: 0,
    orders: 0,
    reservations: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRevenue();
  }, []);

  //get today revenue
  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const response = await axios.get("api/daily-revenue");
      setRevenueData(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to fetch revenue data",
      });
    } finally {
      setLoading(false);
    }
  };

  //pie chart
  const pieData = {
    labels: ["Orders", "Reservations"],
    datasets: [
      {
        data: [revenueData.orders, revenueData.reservations],
        backgroundColor: ["#FFEB3B", "#F44336"],
        hoverBackgroundColor: ["#FDD835", "#D32F2F"], 
        borderColor: "#ffffff", 
        borderWidth: 2,
      },
    ],
  };
  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#333",
          font: {
            size: 13,
            family: "Poppins, sans-serif",
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true, 
  };

  const date = new Date()
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "Desember",
  ];

  // Dapatkan hari, bulan, dan tahun
  const day = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  const niceFormattedDate = `${day} ${monthName} ${year}`

  return (
    <div className="rev-con">
      <h4 className="poppins-regular">Daily Revenue</h4>
      <div className="rev-datas">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="total-revenue">
              <p className="poppins-regular">Total Revenue Today:</p>
              <h1 className="quicksand">Rp {revenueData.total.toLocaleString()}</h1>
              <p className="poppins-regular" style={{color: "gray"}}>{niceFormattedDate}</p>
            </div>
            <div className="revenue-chart">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Revenue;
