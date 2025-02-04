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

import avatar from "../../img/avatar.jpeg";

const CommentStat = ({ comCount, topCommenter, commentDateStats, statCount }) => {
  const colorMap = {
    Private: "#818f81",
    Public: "#38fc45",
  };
  //pie
  const pieChartData = {
    labels: (statCount || []).map((comment) => comment._id),
    datasets: [
      {
        data: (statCount || []).map((comment) => comment.count),
        backgroundColor: (statCount || []).map(
          (comment) => colorMap[comment._id] || "#ccc"
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
          label: (tooltipItem) => `${tooltipItem.raw} Comments`,
        },
      },
    },
  };

  //line
  const lineChartData = {
    labels: (commentDateStats || []).map((entry) => entry._id),
    datasets: [
      {
        label: "Comments",
        data: (commentDateStats || []).map((entry) => entry.count),
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
          text: "Amount",
          font: { family: "Poppins", size: 12, weight: "bold" },
          color: "black",
        },
        ticks: {
          callback: (value) => `${value.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <>
      <div className="prodstat-1">
        <div className="ttl-product">
          <i className="bi bi-chat-left-dots-fill"></i>
          <div>
            <h3 className="poppins-regular">{comCount || 0}</h3>
            <p>Comments</p>
          </div>
        </div>
        <div className="most-selled">
          <div>
            <p>#1 Most Commented</p>
            <img src={avatar} loading="lazy" />
          </div>
          <div>
            <h5 className="poppins-regular">{topCommenter.username}</h5>
            <p>{topCommenter.email}</p>
            <p>{topCommenter.commentCount} comments</p>
          </div>
        </div>
      </div>

      <div className="prodstat-2">
        <p>Comment Over Time</p>
        <div>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      <div className="prodstat-3">
        <div>
          <p>Com-Status Distribution</p>
          <span>Private | Public</span>
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

export default CommentStat;
