import React, { useState } from "react";

import NoData from "../../components/NoData";
import OrderDetails from "../../components/OrderDetails";

const OrdersGrid = ({ orders = [], onSearch, onSort, onFilterDate }) => {
  const [selectedOrder, setSelectedOrder] = useState({});
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  //handle open details
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsPopup(!showDetailsPopup);
  };
  return (
    <>
      <div className="filters">
        <div className="search-input">
          <i className="bi bi-search"></i>
          <input
            className="quicksand"
            type="search"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <div className="other-filt">
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => onFilterDate(e.target.value)}
            className="date-input"
          />
          <select
            className="quicksand"
            onChange={(e) => onSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
      <div className="orders-grid">
        {orders.length === 0 ? (
          <NoData str={"No order found"} />
        ) : (
          orders.map((order) => (
            <div
              className="order-item-grid"
              key={order._id}
              onClick={() => handleOpenDetails(order)}
            >
              <div className="item-header">
                <div>
                  <p className="ord-num poppins-regular">{order.orderNumber}</p>
                  <p className="ord-num">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")} -{" "}
                    {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`${
                    order.paymentStatus === "Pending"
                      ? "res-pending"
                      : order.paymentStatus === "Paid"
                      ? "res-confirmed"
                      : "res-cancelled"
                  }`}
                >
                  <i className="bi bi-credit-card"></i> {order.paymentStatus}
                </span>
              </div>
              <ul className="product-list">
                {order.productInfo.slice(0, 2).map((product) => (
                  <li key={product._id}>
                    {product.productName} x{product.quantity}
                  </li>
                ))}
                {order.productInfo.length > 2 ? (
                  <li className="prod-etc">
                    See {order.productInfo.length - 2} other items...
                  </li>
                ) : (
                  ""
                )}
              </ul>
              <div className="item-footer">
                <p>Rp{order.fee.toLocaleString("id-ID")}</p>
              </div>
            </div>
          ))
        )}
        <OrderDetails
          isVisible={showDetailsPopup}
          onClose={() => setShowDetailsPopup(false)}
          order={selectedOrder}
          from={"loyalty"}
        />
      </div>
    </>
  );
};

export default OrdersGrid;
