<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react'
import "../admin-css/admin-home.css"
import axios from 'axios'
import InfoCard from '../components/InfoCard'

const AdminHome = () => {
  const [loading, setLoading] = useState(false)
  const [datasCount, setDatasCount] = useState({})

  useEffect(() => {
    setLoading(true)
    axios
    .get("api/all-data-count")
    .then((res) => {
      setDatasCount(res.data)
    })
    .catch((err) => {
      console.log("Something went wrong")
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <div className="body-box">
      <div className="admin-home-container quicksand">
        <div className="admin-home-con1">
          <h2 className="poppins-regular">Welcome Admin!</h2>
          <p className="quicksand">
            Selamat datang di halaman admin, tempat di mana Anda dapat mengelola
            produk, pesanan, dan pengguna. Anda memiliki kontrol penuh untuk
            melihat data penting, memodifikasi informasi, serta melakukan
            analisis untuk kebutuhan usaha. Semua fitur yang ada dirancang untuk
            memudahkan pengelolaan dan pengambilan keputusan yang lebih baik.
          </p>
          <p className="quicksand">
            Di sini, Anda juga dapat mengatur reservasi meja, melihat ulasan
            pelanggan, dan melakukan penghapusan data jika diperlukan. Dengan
            semua fitur yang tersedia, Anda dapat memastikan usaha Anda berjalan
            dengan lancar dan terus berkembang.
          </p>
        </div>
        <div className="admin-home-con2">
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
>>>>>>> 95b76e1 (Initial commit)
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
};

export default AdminHome;
=======
}

export default AdminHome
>>>>>>> 95b76e1 (Initial commit)
