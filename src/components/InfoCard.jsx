import React from "react";
import "../admin/dashboard/admin-home.css";

const InfoCard = ({ img, num, str }) => {
  const truncatedStr = str?.length > 10 ? str.slice(0, 9) + "..." : str;

  return (
    <div className="info-card">
      <i className={`${img}`}></i>
      <div>
        <span className="poppins-regular">{num || 0}</span>
        <p>{truncatedStr}</p>{" "}
      </div>
    </div>
  );
};

export default InfoCard;
