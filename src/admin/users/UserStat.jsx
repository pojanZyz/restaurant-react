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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import avatar from "../../img/avatar.jpeg"

const UserStat = ({ userCount, mostCoins, roleCount }) => {

  //bar
  const chartData = {
    labels: mostCoins.map((user) => user.username),
    datasets: [
      {
        label: "CC Points",
        data: mostCoins.map((user) => user.loyaltyCoins),
        backgroundColor: "rgb(41, 48, 249)",
        borderColor: "rgb(0, 244, 244)",
        borderWidth: 1,
      },
    ],
  };
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
          text: "Users",
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
          text: "CC Points",
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
    admin: "#38fc45",
    customer: "#fce40a",
    cashier: "#28fad3",
  };
  //pie
  const pieChartData = {
    labels: (roleCount || []).map((user) => user._id),
    datasets: [
      {
        data: (roleCount || []).map((user) => user.count),
        backgroundColor: (roleCount || []).map(
          (user) => colorMap[user._id] || "#ccc"
        ),
      },
    ],
  };
  const pieChartOptions = {
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
            return `${tooltipItem.raw} users`;
          },
        },
      },
    },
  };
  return (
    <>
      <div className="prodstat-1">
        <div className="ttl-product">
          <i className="bi bi-person-fill judul"></i>
          <div>
            <h3 className="poppins-regular">{userCount || 0}</h3>
            <p>Users</p>
          </div>
        </div>
        {mostCoins.slice(0, 1).map((user) => (
          <div className="most-selled" key={user._id}>
            <div>
              <p>#1 Most CC Points</p>
              <img src={avatar} alt={user.username} />
            </div>
            <div>
              <h5 className="poppins-regular">{user.username}</h5>
              <p>{user.useremail}</p>
              <p>CC Points: {user.loyaltyCoins}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="prodstat-2">
        <p>Top 5 Most CC Points</p>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="prodstat-3">
        <div>
          <p>Role Distribution</p>
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

export default UserStat;
