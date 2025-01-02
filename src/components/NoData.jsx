import React from 'react'

const NoData = ({str}) => {
  return (
    <div className="no-data-con poppins-regular">
      <h3><i className="bi bi-exclamation-diamond-fill"></i></h3>
      <h4>{str}</h4>
    </div>
  );
}

export default NoData