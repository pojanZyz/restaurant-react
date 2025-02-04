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

import reserved from "../../img/reserved.jpeg";

const ResStat = ({ resCount, nearestRes, revenue, resStatusCount }) => {
  const colorMap = {
    Pending: "#818f81",
    Confirmed: "#38fc45",
    Cancelled: "#ff3908",
  };
  //pie
  const pieChartData = {
    labels: (resStatusCount || []).map((reservation) => reservation._id),
    datasets: [
      {
        data: (resStatusCount || []).map((reservation) => reservation.count),
        backgroundColor: (resStatusCount || []).map(
          (reservation) => colorMap[reservation._id] || "#ccc"
        ),
      },
    ],
  };
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { family: "Poppins", size: 12 },
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} reservations`,
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
    maintainAspectRatio: false,
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
          callback: (value) => `Rp${value.toLocaleString()}`,
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
            <h3 className="poppins-regular">{resCount || 0}</h3>
            <p>Reservations</p>
          </div>
        </div>
        <div className="most-selled">
          <div>
            <p>Nearest Res-Date</p>
            <img src={reserved} loading="lazy" />
          </div>
          <div>
            {nearestRes ? (
              <>
                <h5 className="poppins-regular">
                  {nearestRes.customerDetails?.name ||
                    nearestRes.userInfo?.username ||
                    "N/A"}
                </h5>
                <p>
                  {nearestRes.customerDetails?.phoneNumber ||
                    nearestRes.userInfo?.phoneNumber ||
                    "N/A"}
                </p>
                <p>
                  <i className="bi bi-calendar-fill"></i>{" "}
                  {new Date(nearestRes.reservationDate).toLocaleDateString(
                    "id-ID"
                  ) || "N/A"}
                </p>
                <p>
                  <i className="bi bi-clock-fill"></i>{" "}
                  {nearestRes.reservationTime || "N/A"}
                </p>
              </>
            ) : (
              <h5 className="poppins-regular" style={{padding: "0 20px"}}>N/A</h5>
            )}
          </div>
        </div>
      </div>

      <div className="prodstat-2">
        <p>Revenue Over Time</p>
        <div>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      <div className="prodstat-3">
        <div>
          <p>Res-Status Distribution</p>
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

export default ResStat;
