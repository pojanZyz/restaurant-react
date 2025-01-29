import React, {useState, useEffect} from "react";

import useAuth from "../../js/useAuth";
import Loader from "../../components/Loader";
const DiscountTab = () => {
    const { token, tokenLoading } = useAuth();
    const [loading, setLoading] = useState(false);
  return (
    <>
      {(loading || tokenLoading) && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

      <div>
        test
      </div>
    </>
  );
};

export default DiscountTab;
