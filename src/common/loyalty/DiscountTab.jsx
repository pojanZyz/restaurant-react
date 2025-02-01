import React, { useState } from "react";

import Loader from "../../components/Loader";
import axios from "axios";
import Swal from "sweetalert2";
import NoData from "../../components/NoData";
const DiscountTab = ({
  userCoins,
  token,
  discounts = [],
  userDiscounts = [],
}) => {
  const [loading, setLoading] = useState(false);

  //handle redeem
  const handleRedeem = async (discountId) => {
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Buy this discount code?",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setLoading(true);
      try {
        const res = await axios.put(
          "api/discount-redeem",
          {
            discountId: discountId,
            customerCoins: userCoins,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message,
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to redeem",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

      <div className="redeem-con">
        <p className="title">Redeem Your CC Points</p>
        <div className="discount-codes">
          {discounts.length === 0 ? (
            <NoData str={"Sorry, no discount code to redeem"} />
          ) : (
            discounts.map((discount) => (
              <div className="discount-card" key={discount._id}>
                <p>********</p>
                <div className="center">
                  <p>Discount</p>
                  <h4>
                    {discount.discountType === "percentage"
                      ? `${discount.discountValue}%`
                      : `Rp${discount.discountValue.toLocaleString("id-ID")}`}
                  </h4>
                </div>
                <div className="footer">
                  <p>
                    <i className="bi bi-coin"></i> {discount.costInCoins}
                  </p>
                  <button
                    className="poppins-regular"
                    onClick={() => handleRedeem(discount._id)}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="redeem-con">
        <p className="title">Your discount codes</p>
        <div className="discount-grid">
          {userDiscounts.length === 0 ? (
            <NoData str={"You still have no codes"} />
          ) : (
            userDiscounts.map((discount) => {
              const [inputType, setInputType] = useState(true);
              return (
                <div className="discount-grid-item" key={discount._id}>
                  <div className="start">
                    <p className="title">Discount</p>
                    <p className="poppins-regular">
                      {discount.discountType === "percentage"
                        ? `${discount.discountValue}%`
                        : `Rp${discount.discountValue.toLocaleString("id-ID")}`}
                    </p>
                  </div>
                  <div className="center">
                    <input
                      className="poppins-regular"
                      type={inputType ? "password" : "text"}
                      readOnly
                      value={discount.discountCode}
                      maxLength={12}
                    />
                    <i
                      className={
                        inputType ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"
                      }
                      onClick={() => setInputType(!inputType)}
                    ></i>
                  </div>
                  <div className="end">
                    <span>Expiry Date: </span>
                    <span>
                      {new Date(discount.expiryDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default DiscountTab;
