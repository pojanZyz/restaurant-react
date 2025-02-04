import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import "./admin-menu.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ProductStat = ({ productCount, bestSellingProducts, catCount }) => {
  const chartData = {
    labels: bestSellingProducts.map((product) => product.productName),
    datasets: [
      {
        label: "Total Sales",
        data: bestSellingProducts.map((product) => product.totalSales),
        backgroundColor: "rgb(41, 48, 249)",
        borderColor: "rgb(0, 244, 244)",
        borderWidth: 1,
      },
    ],
  };

  // Opsi untuk chart Bar
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
          text: "Products",
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
          text: "Total Sales",
          font: {
            family: "Poppins",
            size: 12,
            weight: "bold",
          },
          color: "black",
        },
        ticks: {
          font: {
            family: "Poppins",
            size: 12,
          },
          color: "#666",
        },
      },
    },
  };

  const colorMap = {
    food: "#fce40a",
    drink: "#28fad3",
    other: "#807e6e",
  };
  //pie
  const pieChartData = {
    labels: (catCount || []).map((category) => category._id),
    datasets: [
      {
        data: (catCount || []).map((category) => category.count),
        backgroundColor: (catCount || []).map(
          (category) => colorMap[category._id] || "#ccc"
        ),
      },
    ],
  };

  // Opsi untuk chart Pie
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Poppins",
            size: 12,
          },
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw} products`;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="prodstat-1">
        <div className="ttl-product">
          <i className="bi bi-cart-fill"></i>
          <div>
            <h3 className="poppins-regular">{productCount || 0}</h3>
            <p>Products</p>
          </div>
        </div>
        {bestSellingProducts.slice(0, 1).map((product) => (
          <div className="most-selled" key={product._id}>
            <div>
              <p className="ms-title">#1 Product Sales</p>
              <img src={product.productImagePath} alt={product.productName} />
            </div>
            <div>
              <h5 className="poppins-regular">{product.productName}</h5>
              <p>Total Sales: {product.totalSales}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prodstat-2">
        <p>Top 5 Products Sales</p>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="prodstat-3">
        <div>
          <p>Category Distribution</p>
        </div>
        <div>
          <Pie
            data={pieChartData}
            options={pieChartOptions}
            height={200}
            width={200}
          />
        </div>
      </div>
    </>
  );
};

export default ProductStat;
