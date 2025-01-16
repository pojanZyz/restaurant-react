import React from "react";
import html2canvas from "html2canvas";

const OrderDetails = ({ isVisible, onClose, order }) => {
  //handle download sebagai gambar
  const handleDownloadAsImage = () => {
    const element = document.querySelector(".receipt"); 
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `order_${order.orderNumber}.png`; // Nama file gambar
      link.click();
    });
  };

  //handle print
  const handlePrint = () => {
    window.print();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`order-details-con poppins-regular ${
        isVisible ? "ani-appear" : ""
      }`}
      onClick={onClose}
    >
      <div className="ord-detail-card">
        <div className="ord-card-header">
          <i className="bi bi-x-square-fill x-btn" onClick={onClose}></i>
          <p className="poppins-regular">Order Details</p>
        </div>
        <div className="receipt">
          <strong>CafeCoding</strong>
          <p>Jl. Cinta Kasih No. 123</p>
          <p>Telp No.08391920321</p>
          <span>==============================</span>
          <div className="receipt-date">
            <div>Code: {order.orderNumber}</div>
            <div>Cashier: nama kasir</div>
            <div>
              {new Date(order.createdAt).toLocaleDateString("id-ID")} -{" "}
              {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <span>----------------------------</span>
          <div className="receipt-items">
            {order.productInfo.map((item) => (
              <div className="item" key={item._id}>
                <span>
                  {item.productName} {item.quantity}x
                </span>
                <span>
                  Rp.{" "}
                  {(item.productPrice * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
          <span>----------------------------</span>
          <div className="receipt-fee">
            <div className="item">
              <span>Tax:</span>
              <span>tax here</span>
            </div>
            <div className="item">
              <span>Discount:</span>
              <span>disc here</span>
            </div>
            <div className="item">
              <span>Total:</span>
              <span>Rp{order.fee.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <span>----------------------------</span>
          <div className="receipt-final">
            <div>Payment Method: {order.paymentMethod}</div>
            {order.paymentMethod !== "Cash" ? (
              ""
            ) : (
              <>
                <div>Money: Rp.money here</div>
                <div>Change: Rp.change here</div>
              </>
            )}
          </div>
        </div>
        <div className="ord-card-footer">
          <button className="download-btn" onClick={handleDownloadAsImage}>
            <i className="bi bi-file-earmark-arrow-down-fill"></i> Download as Image
          </button>
          <button className="print-btn" onClick={handlePrint}>
            <i className="bi bi-printer-fill"></i> Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
