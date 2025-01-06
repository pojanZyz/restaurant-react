import React from "react";

const AccountPopup = ({ isVisible, onClose, profile, onDelete }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isVisible) {
      setUsername(profile.username || "");
    }
  }, [reservation, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`update-con poppins-regular ${isVisible ? "ani-appear" : ""}`}
      onClick={onClose}
    >
      <div
        className="res-details-card quicksand"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header">
          <i className="bi bi-x-square-fill x-btn" onClick={onClose}></i>
          <span>Reservation Details</span>
        </div>
        <div className="card-content"></div>
      </div>
    </div>
  );
};

export default AccountPopup;
