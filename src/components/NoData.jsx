import React from 'react'

const NoData = ({str}) => {
  return (
    <div className="no-data-con poppins-regular">
      <h3><i className="bi bi-exclamation-diamond-fill"></i></h3>
      <h5>{str}</h5>
    </div>
  );
}

export default NoData