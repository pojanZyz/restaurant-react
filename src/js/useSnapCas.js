import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const useSnapCas = (clientKey) => {
  const navigate = useNavigate();
  useEffect(() => {
    const existingScript = document.getElementById("midtrans-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "midtrans-script";
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.type = "text/javascript";
      script.async = true;
      script.setAttribute("data-client-key", clientKey);
      document.body.appendChild(script);
    }

    return () => {
      const script = document.getElementById("midtrans-script");
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [clientKey]);

  const triggerPayment = (snapToken, orderId) => {
    if (window.snap) {
      window.snap.pay(snapToken, {
        //payment success
        onSuccess: (result) => {
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Payment Success! Order made",
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/cashier");
        },

        //payment pending
        onPending: (result) => {
          Swal.fire({
            icon: "info",
            title: "Information",
            text: "Payment on pending",
          });
          navigate("/cashier");
        },

        //payment error
        onError: (result) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.status_message || "Failed to do payment",
          });
        },

        //close payment
        onClose: () => {
          axios
            .delete(`api/order/${orderId}`)
            .then((res) => {
              Swal.fire({
                title: "Information",
                icon: "info",
                text: "Order deleted due to closing payment",
              });
            })
            .catch((err) => {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Something went wrong",
              });
            })
            .finally(() => {
              navigate("/cashier");
            });
        },
      });
    } else {
      alert("Midtrans Snap script not loaded yet.");
    }
  };

  return { triggerPayment };
};

export default useSnapCas;
