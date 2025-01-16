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

  const pieData = {
    labels: ["Orders", "Reservations"],
    datasets: [
      {
        data: [revenueData.orders, revenueData.reservations],
        backgroundColor: ["#FFEB3B", "#F44336"], // Warna kuning untuk Orders, merah untuk Reservations
        hoverBackgroundColor: ["#FDD835", "#D32F2F"], // Warna hover
        borderColor: "#ffffff", // Border putih
        borderWidth: 2, // Lebar border
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
    maintainAspectRatio: true, // Responsif
  };

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
