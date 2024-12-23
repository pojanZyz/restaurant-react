import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "../css/admin-home.css";

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Chart Data
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Sales and Revenue',
    },
  },
};

// AdminHome Component
const AdminHome = () => {
  return (
    <div className="body-box">
      <div className="home-menu">
        <div className="admin-home-wrapper">
          <div className="admin-home">
            <div className="left-section">
              {/* Sales and Revenue Chart */}
              <section className="grafik-section">
                <Line data={chartData} options={chartOptions} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
