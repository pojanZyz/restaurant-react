import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "../admin-css/cas-res.css";
import Loader from "../components/Loader";
import useAuth from "../js/useAuth";
import useSnap from "../js/useSnap";
import { Helmet } from "react-helmet";

const CasReservation = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { triggerPayment } = useSnap(import.meta.env.VITE_MIDTRANS_CLIENT_KEY);

  const [tables, setTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [username, setUsername] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [debouncedCusEmail, setDebouncedCusEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedTables, setSelectedTables] = useState([]);

  const [cusEmailLoading, setCusEmailLoading] = useState(false);
  const [isCusEmailValid, setIsCusEmailValid] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);
  useEffect(() => {
    fetchTables();
    setSelectedTables([]);
  }, [selectedDate]);
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedCusEmail(customerEmail), 1000);
    return () => clearTimeout(delay);
  }, [customerEmail]);

  //get all tables
  const fetchTables = async () => {
    if (selectedDate) {
      setLoading(true);
      try {
        const res = await axios.get(`api/table?date=${selectedDate}`);
        setTables(res.data.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  //select table
  const handleTableClick = (table) => {
    if (table.status === "Available") {
      setSelectedTables((prev) => {
        const alreadySelected = prev.find((t) => t._id === table._id);
        if (alreadySelected) {
          return prev.filter((t) => t._id !== table._id);
        } else {
          return [...prev, { _id: table._id, tableNumber: table.tableNumber }];
        }
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Table not available",
        text: "Please select an available table.",
      });
    }
  };

  //check cus email
  const checkCustomerEmail = useCallback(async () => {
    if (customerEmail == "") {
      setIsCusEmailValid("");
      setUsername("");
      setPhoneNumber("");
      return;
    }
    setCusEmailLoading(true);
    try {
      const res = await axios.get(`api/user-by-email/${debouncedCusEmail}`);
      if (res.status === 200) {
        setIsCusEmailValid(res.status === 200 ? "valid" : "invalid");
        setUsername(res.data.username);
        setPhoneNumber(res.data.phoneNumber);
      } else {
        setIsCusEmailValid("invalid");
        setUsername("");
        setPhoneNumber("");
      }
    } catch (error) {
      console.error(error);
      setIsCusEmailValid("invalid");
    } finally {
      setCusEmailLoading(false);
    }
  }, [debouncedCusEmail]);
  useEffect(() => {
    checkCustomerEmail();
  }, [checkCustomerEmail]);

  //create reservation
  const handleReservation = async (e) => {
    e.preventDefault();
    if (
      !username ||
      !phoneNumber ||
      selectedTables.length === 0 ||
      !reservationTime ||
      !selectedDate ||
      !paymentMethod
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Request is incomplete",
      });
    }
    if (customerEmail && isCusEmailValid === "invalid") {
      return Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Email or Discount code is invalid",
      });
    }
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Confirm the reservation creation?",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setLoading(true);
      try {
        const reservationData = {
          username,
          useremail: customerEmail,
          phoneNumber,
          reservationDate: selectedDate,
          reservationTime,
          notes,
          paymentMethod,
          tableIds: selectedTables.map((t) => t._id),
        };
        const res = await axios.post("api/reservation-cas", reservationData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsername("");
        setPhoneNumber("");
        setCustomerEmail("");
        setReservationTime("");
        setSelectedTables([]);
        setNotes("");

        //cash payment ends here
        if (!res.data.token) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.data.message || "New reservation created!",
            timer: 2000,
            showConfirmButton: false,
          });
        }

        //online payment
        if (res.data.token) {
          const snapToken = res.data.token;
          const reservationId = res.data.reservationId;
          triggerPayment(snapToken, reservationId);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to make reservation",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>CafeCoding | Reservation Cashier</title>
      </Helmet>
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="casres-container quicksand">
        <div className="table-wrap">
          <h4 className="poppins-regular">Select the table based on date</h4>
          <p>
            Click the table to select. You can select more than one table, as
            long as the table is available.
          </p>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input quicksand"
          />
          <ul className="legend-con">
            <li>
              <div className="green-sqr"></div> : Available
            </li>
            <li>
              <div className="red-sqr"></div> : Reserved
            </li>
            <li>
              <div className="gray-sqr"></div> : Occupied
            </li>
          </ul>
          <div className="tables-box">
            {tables.map((table) => (
              <div
                className={`table-grid-item ${
                  table.status === "Available"
                    ? selectedTables.find((t) => t._id === table._id)
                      ? "table-selected"
                      : "table-available"
                    : table.status === "Reserved"
                    ? "table-reserved"
                    : "table-occupied"
                }`}
                key={table._id}
                onClick={() => handleTableClick(table)}
              >
                <div className="table-cap">
                  <i className="bi bi-people-fill"></i>
                  {table.capacity}
                </div>
                <div className="poppins-regular">{table.tableNumber}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="form-wrap">
          <h3 className="poppins-regular">
            Cashier-Res <span className="order-type-cas">CAS</span>
          </h3>
          <form className="casres-form" onSubmit={handleReservation}>
            <div className="row-1">
              <div className="cus-details">
                <h5>Customer Details</h5>
                <hr />
                <label htmlFor="username">Name</label>
                <input
                  className="quicksand"
                  type="text"
                  maxLength={20}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <label htmlFor="phoneNumber">Active Phone Number</label>
                <input
                  className="quicksand"
                  type="number"
                  maxLength={14}
                  value={phoneNumber}
                  placeholder="08xxxxx"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <label htmlFor="useremail">Email (member only)</label>
                <div className="email-inp">
                  <input
                    className="quicksand"
                    type="email"
                    maxLength={30}
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                  <div className="disc-status">
                    {cusEmailLoading ? (
                      <div className="small-loader"></div>
                    ) : isCusEmailValid === "valid" ? (
                      <i
                        className="bi bi-check-circle-fill"
                        style={{ color: "green" }}
                      ></i>
                    ) : isCusEmailValid === "invalid" ? (
                      <i
                        className="bi bi-x-circle-fill"
                        style={{ color: "red" }}
                      ></i>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="res-details">
                <h5>Reservation Details</h5>
                <hr />
                <label htmlFor="date">Date and time</label>
                <div className="date-time-con">
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    className="quicksand"
                    readOnly
                  />
                  <input
                    type="time"
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
                    className="quicksand"
                    max="24:00"
                    min="00:00"
                  />
                </div>
                <label htmlFor="selectedTables">Selected Tables</label>
                <input
                  type="text"
                  value={
                    selectedTables.length > 0
                      ? selectedTables
                          .map((t) => `Table ${t.tableNumber}`)
                          .join(", ")
                      : "No tables selected"
                  }
                  readOnly
                  required
                  className="quicksand"
                />
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="quicksand"
                  rows={4}
                ></textarea>
              </div>
            </div>
            <div className="row-2">
              <div>
                <h5>Payment Method</h5>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={paymentMethod === "Cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />{" "}
                  Cash
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />{" "}
                  Online (via Midtrans)
                </label>
              </div>
              <div className="confirm-con">
                <div>
                  <p>Fee</p>
                  <h5>Rp. 30.000</h5>
                </div>
                <button type="submit" className="confirm-btn poppins-regular">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CasReservation;
