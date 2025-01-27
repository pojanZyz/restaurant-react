import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import expired from "../../img/expired.jpeg";

const DiscStat = ({ discountCount, nearestExp, typeCount, statCount }) => {
  const [nearestExpDate, setNearestExpDate] = useState("");
  //pie 1
  const typeChartData = {
    labels: (typeCount || []).map((type) => type._id),
    datasets: [
      {
        data: (typeCount || []).map((type) => type.count),
        backgroundColor: ["gold", "green"],
      },
    ],
  };

  //pie 2
  const statChartData = {
    labels: (statCount || []).map((stat) => stat._id),
    datasets: [
      {
        data: (statCount || []).map((stat) => stat.count),
        backgroundColor: ["green", "red", "gray"],
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
          },
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.raw} discounts`;
          },
        },
      },
    },
  };

  useEffect(() => {
    console.log(nearestExp)
    if (nearestExp && nearestExp.length > 0) {
      setNearestExpDate(nearestExp[0].expiryDate);
    }
  }, [nearestExp]);

  return (
    <>
      <div className="prodstat-1">
        <div className="ttl-product">
          <i className="bi bi-percent"></i>
          <div>
            <h3 className="poppins-regular">{discountCount || 0}</h3>
            <p>Discounts</p>
          </div>
        </div>
        <div className="most-selled">
          <div>
            <p>Near to expired</p>
            <img src={expired} />
          </div>
          <div className="disc-list">
            {nearestExp.length !== 0 ? (
              <>
                <div>
                  <i className="bi bi-calendar-event-fill"></i>
                  <span>
                    {" "}
                    {new Date(nearestExpDate).toLocaleDateString("id-ID") ||
                      "N/A"}
                  </span>
                </div>
                {nearestExp.map((discount) => (
                  <p key={discount._id}>- {discount.discountCode || "N/A"}</p>
                ))}
              </>
            ) : (
              <h5 className="poppins-regular" style={{ padding: "0 20px" }}>
                N/A
              </h5>
            )}
          </div>
        </div>
      </div>

      <div className="prodstat-3">
        <div>
          <p>Type Distribution</p>
        </div>
        <div>
          <Pie
            data={typeChartData}
            options={chartOptions}
            height={200}
            width={200}
          />
        </div>
      </div>

      <div className="prodstat-3">
        <div>
          <p>Status Distribution</p>
        </div>
        <div>
          <Pie
            data={statChartData}
            options={chartOptions}
            height={200}
            width={200}
          />
        </div>
      </div>
    </>
  );
};

export default DiscStat;
