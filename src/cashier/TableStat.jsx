import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import CashierLoader from "../components/CashierLoader";
import TablePopupCas from "../components/TablePopupCas";
import useAuth from "../js/useAuth";

const TableStat = () => {
  const { token, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedTable, setSelectedTable] = useState({});

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);
  useEffect(() => {
    fetchTables();
  }, [selectedDate]);

  //get all table
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

  //handle update
  const handleUpdateTable = async (updatedTable) => {
    setLoading(true);
    setShowUpdatePopup(false);
    try {
      const res = await axios.patch(
        `api/table-cas/${updatedTable._id}`,
        updatedTable,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 2000,
      });
      fetchTables();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response.data.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  //table click
  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowUpdatePopup(!showUpdatePopup);
  };
  return (
    <div className="tablestat-con quicksand">
      {loading ? (
        <CashierLoader />
      ) : (
        <>
          <div className="header">
            <h5 className="poppins-regular">Table Status: {selectedDate}</h5>
          </div>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input quicksand"
          />
          <ul className="legendstat-con">
            <li>
              <div className="green-sqr"></div> :Available
            </li>
            <li>
              <div className="red-sqr"></div> :Reserved
            </li>
            <li>
              <div className="gray-sqr"></div> :Occupied
            </li>
          </ul>
          <div className="tablestat-box">
            {tables.map((table) => (
              <div
                className={`tablestat-grid-item ${
                  table.status === "Available"
                    ? "table-available"
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
        </>
      )}
      <TablePopupCas
        isVisible={showUpdatePopup}
        onClose={() => setShowUpdatePopup(false)}
        onUpdate={handleUpdateTable}
        table={selectedTable}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default TableStat;
