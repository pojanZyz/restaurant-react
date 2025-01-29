import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const LoginAlert = ({token}) => {
  const [closed, setClosed] = useState(false);

  if (closed || token ) return null
  return (
    <div className={`loginalert-con`}>
      <p>
        It seems that you haven't login yet.{" "}
        <NavLink to={"/login"}>Login here</NavLink>
      </p>
      <button onClick={() => setClosed(true)}>
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
};

export default LoginAlert;
