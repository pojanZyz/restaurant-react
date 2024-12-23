import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const MejaReservasiTable = () => {
  const [filteredMeja, setFilteredMeja] = useState([]);
  const [filteredReservasi, setFilteredReservasi] = useState([]);
  const [searchMeja, setSearchMeja] = useState("");
  const [searchReservasi, setSearchReservasi] = useState("");

  // Fetch Meja and Reservasi data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://cafemdn-api.vercel.app/api/table"
        );
        const data = await response.json();
        console.log("Fetched table data:", data); // Log to check the structure of data

        // Separate data into Meja and Reservasi
        const mejaData = data.data.filter((item) => item.isMeja);
        const reservasiData = data.data.filter((item) => !item.isMeja);

        console.log("Filtered Meja Data:", mejaData); // Log the filtered Meja data
        console.log("Filtered Reservasi Data:", reservasiData); // Log the filtered Reservasi data

        setFilteredMeja(mejaData);
        setFilteredReservasi(reservasiData);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };

    fetchData();
  }, []);

  // Define columns for Meja
  const columnsMeja = [
    { name: "Table Number", selector: "tableNumber", sortable: true },
    { name: "Capacity", selector: "capacity", sortable: true },
    { name: "Status", selector: "status", sortable: true },
  ];

  // Define columns for Reservasi
  const columnsReservasi = [
    { name: "Reservation Name", selector: "reservationName", sortable: true },
    { name: "Reservation Time", selector: "reservationTime", sortable: true },
    { name: "Number of People", selector: "numPeople", sortable: true },
  ];

  // Filter Meja based on search query
  const filteredMejaData = filteredMeja.filter((item) => {
    return Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchMeja.toLowerCase());
  });

  // Filter Reservasi based on search query
  const filteredReservasiData = filteredReservasi.filter((item) => {
    return Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchReservasi.toLowerCase());
  });

  console.log("Filtered Meja Data:", filteredMejaData); // Log the final filtered Meja data
  console.log("Filtered Reservasi Data:", filteredReservasiData); // Log the final filtered Reservasi data

  return (
    <div className="body-box">
      <div className="reservation-container">
        <section className="crud-section">
          <h3>CRUD MEJA & RESERVASI</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search Table Status"
              value={searchMeja}
              onChange={(e) => setSearchMeja(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search Reservation"
              value={searchReservasi}
              onChange={(e) => setSearchReservasi(e.target.value)}
            />
          </div>

          {/* Meja DataTable */}
          <DataTable
            columns={columnsMeja}
            data={filteredMejaData}
            title="Meja"
            pagination
          />

          {/* Reservasi DataTable */}
          <DataTable
            columns={columnsReservasi}
            data={filteredReservasiData}
            title="Reservasi"
            pagination
          />
        </section>
      </div>
    </div>
  );
};

export default MejaReservasiTable;
