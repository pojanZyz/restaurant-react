import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

import orderpic from "../../img/order.jpg";

const OrderStat = ({ orderCount, bestOrders, revenue }) => {
  const formatFee = (value) => {
    if (value >= 1000000) {
      return `Rp${(value / 1000000).toFixed(1)}jt`;
    } else if (value >= 1000) {
      return `Rp${(value / 1000).toFixed(1)}k`;
    }
    return `Rp${value.toLocaleString()}`;
  };
  const chartData = {
    labels: bestOrders.map((order) => order.orderNumber),
    datasets: [
      {
        label: "Total Sales",
        data: bestOrders.map((order) => order.fee),
        backgroundColor: "rgb(41, 48, 249)",
        borderColor: "rgb(0, 244, 244)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Poppins",
            size: 12,
            weight: "bold",
          },
          color: "#333",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Order Number",
          font: {
            family: "Poppins",
            size: 12,
            weight: "bold",
          },
          color: "black",
        },
        ticks: {
          stepSize: 5,
          font: {
            family: "Quicksand",
            size: 11,
          },
          color: "black",
        },
      },
      y: {
        title: {
          display: true,
          text: "Fee",
          font: {
            family: "Poppins",
            size: 12,
            weight: "bold",
          },
          color: "black",
        },
        ticks: {
          callback: (value) => formatFee(value),
          font: {
            family: "Poppins",
            size: 12,
          },
          color: "#666",
        },
      },
    },
  };

  //line
  const lineChartData = {
    labels: (revenue || []).map((entry) => entry._id),
    datasets: [
      {
        label: "Revenue",
        data: (revenue || []).map((entry) => entry.totalRevenue),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 158, 175, 0.2)",
        tension: 0.3,
      },
    ],
  };
  const lineChartOptions = {
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
    <>
      <div className="prodstat-1">
        <div className="ttl-product">
          <i className="bi bi-bag-check-fill"></i>
          <div>
            <h3 className="poppins-regular">{orderCount || 0}</h3>
            <p>Orders</p>
          </div>
        </div>
        {bestOrders.slice(0, 1).map((order) => (
          <div className="most-selled" key={order._id}>
            <div>
              <p>#1 Order by fee </p>
              <img src={orderpic} />
            </div>
            <div>
              <h5 className="poppins-regular">{order.orderNumber}</h5>
              <p>Fee: Rp{order.fee.toLocaleString("id-ID")}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prodstat-2">
        <p>Top 5 Most fee</p>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="prodstat-2">
        <p>Revenue Over Time</p>
        <div>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </>
  );
};

export default OrderStat;
