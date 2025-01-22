import React, { useEffect, useState } from "react";

const AccountPopup = ({ isVisible, onClose, onLogout, profile, from }) => {
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");

  useEffect(() => {
    setUsername(profile?.username);
    setUseremail(profile?.useremail);
  }, [profile, isVisible]);

  //handle logout
  const handleLogout = () => {
    onLogout();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`${from === "cashier" ? "order-details-con" : "common-con"} poppins-regular ${
        isVisible ? "ani-appear" : ""
      }`}
      onClick={onClose}
    >
      <div
        className="acc-detail-card quicksand"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ord-card-header">
          <i className="bi bi-x-square-fill x-btn" onClick={onClose}></i>
          <p className="poppins-regular">Account Settings</p>
        </div>
        <form className="acc-body">
          <div>
            <label htmlFor="username">Username</label>
            <div className="acc-input-con">
              <input
                className="quicksand"
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
              />
              <i className="bi bi-person-fill"></i>
            </div>
          </div>
          <div>
            <label htmlFor="useremail">Email</label>
            <div className="acc-input-con">
              <input
                className="quicksand"
                type="email"
                placeholder="Email"
                required
                maxLength={30}
                value={useremail}
                onChange={(e) => setUseremail(e.target.value)}
              />
              <i className="bi bi-envelope-fill"></i>
            </div>
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <div className="acc-input-con">
              <input
                className="quicksand"
                type="text"
                placeholder="Role"
                required
                value={profile?.role}
                readOnly
              />
              <i class="bi bi-person-badge-fill"></i>{" "}
            </div>
          </div>
        </form>
        <div className="acc-footer">
          <button className="logout-btn poppins-regular" onClick={handleLogout}>
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPopup;
