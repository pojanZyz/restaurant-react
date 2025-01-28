import React, { useState, useEffect } from "react";
import axios from "axios";

import useAuth from "../../js/useAuth";
import Loader from "../../components/Loader";
import NoData from "../../components/NoData";
import OrderDetails from "../../components/OrderDetails";

const OrdersGrid = () => {
  const { token, tokenLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [selectedOrder, setSelectedOrder] = useState({})
  const [showDetailsPopup, setShowDetailsPopup] = useState(false)

  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    if (!token || tokenLoading) {
      return;
    }
    fetchOrders();
  }, [token, tokenLoading, debouncedSearch, sort, filterDate]);

  //get user orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/order-user?search=${debouncedSearch}&sort=${sort}&date=${filterDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(res.data.data);
      setOrderCount(res.data.dataCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //handle open details
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsPopup(!showDetailsPopup);
  };
  return (
    <>
      {(loading || tokenLoading) && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="filters">
        <div className="search-input">
          <i className="bi bi-search"></i>
          <input
            className="quicksand"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <input
          type="date"
          value={filterDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setFilterDate(e.target.value)}
          className="date-input"
        />
        <select className="quicksand" onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="orders-grid">
        {orders.length === 0 || orderCount === 0 ? (
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
                  <li>
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
