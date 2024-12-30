import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "../admin-css/admin-table.css";
import useAuth from "../js/useAuth";
import Loader from "../components/Loader";
import UpdateTablePopup from "../components/UpdateTablePopup";
import CreateTablePopup from "../components/CreateTablePopup";

const TableAdmin = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [tableCount, setTableCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTable, setSelectedTable] = useState({});
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    fetchTables();
  }, [selectedDate]);

  const fetchTables = async () => {
    if (selectedDate) {
      setLoading(true);
      try {
        const res = await axios.get(`api/table?date=${selectedDate}`);
        setTables(res.data.data);
        setTableCount(res.data.dataCount);
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

  //handle create
  const handleCreateTable = async (newTable) => {
    const confirmation = confirm("Are you sure? ");
    if (confirmation) {
      setLoading(true);
      setShowCreatePopup(false);
      try {
        const res = await axios.post("api/table", newTable, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowUpdatePopup(!showUpdatePopup);
  };

  //handle update
  const handleUpdateTable = async (updatedTable) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      setLoading(true);
      setShowUpdatePopup(false);
      try {
        const res = await axios.put(
          `api/table/${updatedTable._id}`,
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
    }
  };

  //handle delete
  const handleDeleteTable = async (tableId) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      setLoading(true);
      setShowUpdatePopup(false);
      try {
        const res = await axios.delete(`api/table/${tableId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    }
  };

  return (
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="table-admin-container quicksand">
        <div className="admin-table-con1">
          <h2 className="poppins-regular">
            <i className="bi bi-table"></i> Tables
          </h2>
        </div>

        <div className="admin-table-con2">
          <div className="control-panel-table">
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
            <div className="table-count-con">
              <span className="poppins-regular">
                {tableCount || 0} <i className="bi bi-table"></i>
              </span>
              <span className="span-2">TABLES</span>
            </div>
            <button
              className="add-table-btn poppins-regular"
              onClick={() => setShowCreatePopup(!showCreatePopup)}
            >
              <i className="bi bi-plus-square"></i> Add new product
            </button>
          </div>
          <div className="table-main-con">
            <h4 className="poppins-regular">Click to do actions</h4>
            <p>
              Table in: {selectedDate}{" "}
              {selectedDate == new Date().toISOString().split("T")[0]
                ? "(Today)"
                : " "}
            </p>
            <ul className="admin-legend-con">
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

            <div className="admin-tables-box">
              {tables.map((table) => (
                <div
                  className={`admin-table-grid-item ${
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
          </div>
        </div>
      </div>

      <UpdateTablePopup
        isVisible={showUpdatePopup}
        onClose={() => setShowUpdatePopup(false)}
        table={selectedTable}
        onUpdate={handleUpdateTable}
        onDelete={handleDeleteTable}
        selectedDate={selectedDate}
      />

      <CreateTablePopup
        isVisible={showCreatePopup}
        onClose={() => setShowCreatePopup(false)}
        onCreate={handleCreateTable}
      />
    </div>
  );
};

export default TableAdmin;
