import React, { useState, useEffect } from "react";
import "../css/pemesanan.css";
import Select from "react-select";

const Pemesanan = ({ cart }) => {
  const [reservationName, setReservationName] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [numPeople, setNumPeople] = useState(1);
  const [selectedTables, setSelectedTables] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tables, setTables] = useState([]);

  //get all tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(
          "https://cafemdn-api.vercel.app/api/table"
        );
        const data = await response.json();
        console.log("Fetched table data:", data);
        if (Array.isArray(data.data)) {
          setTables(data.data);
        } else {
          console.error("Data fetched is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };
    fetchTables();
  }, []);

  const customStyles = {
    option: (provided) => ({
      ...provided,
      color: "black",
      fontSize: "16px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
      fontSize: "16px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black",
      fontSize: "16px",
    }),
  };

  //handle 
  const handleTableClick = (table) => {
    if (table.status === "Available") {
      const isSelected = selectedTables.includes(table._id);
      const updatedSelectedTables = isSelected
        ? selectedTables.filter((id) => id !== table._id)
        : [...selectedTables, table._id];
      setSelectedTables(updatedSelectedTables);
      calculateTotalPrice(updatedSelectedTables);

      // Update the table status in the API after selection
      updateTableStatus(table._id, isSelected ? "Available" : "Reserved");
    }
  };

  const handleTableSelection = (selectedOptions) => {
    const selectedIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedTables(selectedIds);
    calculateTotalPrice(selectedIds);

    // Update the table status in the API after selection
    selectedIds.forEach((id) => updateTableStatus(id, "Reserved"));
  };

  const calculateTotalPrice = (selected) => {
    const selectedTableDetails = tables.filter((table) =>
      selected.includes(table._id)
    );
    const total = selectedTableDetails.reduce(
      (sum, table) => sum + table.price,
      0
    );
    setTotalPrice(total);
  };

  const updateTableStatus = async (tableId, newStatus) => {
    try {
      await fetch(`https://cafemdn-api.vercel.app/api/table/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Error updating table status:", error);
    }
  };

  const calculateMaxPeople = () => {
    const selectedTableDetails = tables.filter((table) =>
      selectedTables.includes(table._id)
    );
    return selectedTableDetails.reduce((sum, table) => sum + table.capacity, 0);
  };

  const tableOptions = tables.map((table) => ({
    value: table._id,
    label: `Meja ${table.tableNumber} (Kapasitas: ${table.capacity} orang) - ${
      table.status === "Available" ? "Kosong" : "Terisi"
    }`,
    isDisabled: table.status === "Occupied",
  }));

  return (
    <div className="body-box">
      <div className="content-box">
      <div style={{marginTop: "30px"}}>
        <h2>Reservasi Meja</h2>
      </div>
        {/* Table Reservation Section */}

        <div className="reservation-box">
          <h3>Reservasi Meja</h3>
          <div className="table-grid">
            {tables.map((table) => (
              <div
                key={table._id}
                className={`table-item ${table.status.toLowerCase()} ${
                  selectedTables.includes(table._id) ? "selected" : ""
                }`}
                style={{
                  backgroundColor:
                    table.status === "Occupied"
                      ? "red"
                      : selectedTables.includes(table._id)
                      ? "green"
                      : "white",
                  color: table.status === "Occupied" ? "white" : "black",
                  cursor:
                    table.status === "Occupied" ? "not-allowed" : "pointer",
                }}
                onClick={() => handleTableClick(table)}
              >
                {`Meja ${table.tableNumber} (Kapasitas: ${table.capacity} orang)`}
              </div>
            ))}
          </div>
        </div>

        {/* Reservation Form */}
        <div className="reservation-box">
          <h3>Formulir Reservasi</h3>
          <form>
            <div>
              <label>Nama Pemesan:</label>
              <input
                type="text"
                value={reservationName}
                onChange={(e) => setReservationName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Waktu Reservasi:</label>
              <input
                type="datetime-local"
                value={reservationTime}
                onChange={(e) => setReservationTime(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Jumlah Orang:</label>
              <input
                type="number"
                value={numPeople}
                onChange={(e) => setNumPeople(e.target.value)}
                min="1"
                max={calculateMaxPeople()}
                required
              />
            </div>
            <div>
              <label>Nomor Meja:</label>
              <Select
                isMulti
                styles={customStyles}
                options={tableOptions}
                value={tableOptions.filter((option) =>
                  selectedTables.includes(option.value)
                )}
                onChange={handleTableSelection}
              />
            </div>
            <div>
              <label>Catatan (opsional)</label>
              <textarea>
                
              </textarea>
            </div>
            <p>Total: Rp {totalPrice.toLocaleString()}</p>
            <button type="submit" className="btn btn-primary">
              Reservasi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pemesanan;
