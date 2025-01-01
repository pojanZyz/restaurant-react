import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import useAuth from "../js/useAuth";
import "../css/reservation.css";

const Reservation = () => {
  const { token, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTables, setSelectedTables] = useState([]); 

  const [qrCode, setQrCode] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    fetchTables();
  }, [selectedDate]);

  useEffect(() => {
    if (token) {
      setUsername(userData.username);
      setUseremail(userData.useremail);
    }
  }, [token]);

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

  const handleReservation = async (e) => {
    e.preventDefault();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please login first to continue",
      });
      return navigate("/login");
    }
    if (
      !username ||
      !useremail ||
      !phoneNumber ||
      !selectedDate ||
      !reservationTime ||
      selectedTables.length === 0
    ) {
      return Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Request is incomplete",
      });
    }
    const confirmation = confirm("Make the reservation?");
    if (confirmation) {
      setLoading(true);

      try {
        const reservationData = {
          username,
          useremail,
          phoneNumber,
          reservationDate: selectedDate,
          reservationTime,
          notes,
          tableId: selectedTables.map((t) => t._id),
        };
        const res = await axios.post("api/reservation", reservationData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQrCode(res.data.qrCode)
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "Reservation made successfully!",
          showConfirmButton: false,
          timer: 2000
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to make reservation",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="reservation-container quicksand">
        <div className="reserv-con1">
          <h2 className="poppins-regular">
            <i className="bi bi-calendar-check"></i> Table reservation
          </h2>
          <p>
            Reservation fee is Rp. 30000 per 1 reservation via online after you
            click 'Submit' button in the form
          </p>
        </div>

        <div className="reserv-con2">
          <div className="reserv-con2-sub2">
            <h4 className="poppins-regular">Fill this form below</h4>
            <form className="reservation-form" onSubmit={handleReservation}>
              <label htmlFor="username">Name</label>
              <input
                className="quicksand"
                type="text"
                maxLength={20}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="useremail">Email</label>
              <input
                className="quicksand"
                type="email"
                maxLength={30}
                value={useremail}
                onChange={(e) => setUseremail(e.target.value)}
                required
              />
              <label htmlFor="phoneNumber">Active Phone Number</label>
              <div>
                <input
                  className="quicksand"
                  type="number"
                  maxLength={14}
                  value={phoneNumber}
                  placeholder="08xxxxx"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
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
                />
              </div>
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="quicksand"
                rows={4}
              ></textarea>
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
              <button type="submit" className="reserv-btn poppins-regular">
                Submit
              </button>
            </form>
          </div>
          <div className="reserv-con2-sub1">
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
        </div>
      </div>
    </div>
  );
};

export default Reservation;
