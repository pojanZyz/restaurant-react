import React, { useState } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import Loader from "../../components/Loader";
import CreateTablePopup from "./CreateTablePopup";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../js/useAuth";

const TableStat = ({ tableCount, reservedCount }) => {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const {token} = useAuth()

  //handle create
  const handleCreateTable = async (newTable) => {
    const confirmation = confirm("Are you sure? ");
    if (confirmation) {
      setLoading(true);
      setShowCreatePopup(false);
      try {
        const res = await axios.post("api/table", newTable, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data?.message || "Table Created",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Format data untuk scatter chart
  const scatterChartData = {
    datasets: [
      {
        label: "Reserved Tables",
        data: reservedCount.map((data) => ({
          x: data._id, // Tanggal
          y: data.reservedCount, // Jumlah reserved
        })),
        backgroundColor: "rgba(255, 38, 0, 0.6)",
        pointBorderColor: "rgb(255, 34, 0)",
        pointRadius: 6,
      },
    ],
  };

  // Opsi untuk scatter chart
  const scatterChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Reserved: ${tooltipItem.raw.y}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            family: "Poppins",
            size: 12,
            weight: "bold",
          },
        },
        type: "category",
      },
      y: {
        title: {
          display: true,
          text: "Table Count",
          font: {
            family: "Poppins",
            size: 12,
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="table-stat">
        <div className="row-1">
          <div className="ttl-product">
            <i className="bi bi-table"></i>
            <div>
              <h3 className="poppins-regular">{tableCount || 0}</h3>
              <p>Tables</p>
            </div>
          </div>
          <div
            className="tableadd-con"
            onClick={() => setShowCreatePopup(!showCreatePopup)}
          >
            <i className="bi bi-table"></i>
            <div>
              <i className="bi bi-plus-square-dotted"></i>
              <p>Add new table</p>
            </div>
          </div>
        </div>
        <div className="scat-chart">
          <p>Reserved Tables</p>
          <Scatter data={scatterChartData} options={scatterChartOptions} />
        </div>
      </div>
      <CreateTablePopup
        isVisible={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onCreate={handleCreateTable}
      />
    </>
  );
};

export default TableStat;
