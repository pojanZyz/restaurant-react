import React from "react";
import DataTable from "react-data-table-component";

const PurchaseHistory = ({ purchaseHistory }) => {
  const columns = [
    {
      name: "Nama Pelanggan",
      selector: (row) => row.customerName,
      sortable: true,
    },
    {
      name: "Metode Pembayaran",
      selector: (row) => row.paymentMethod,
      sortable: true,
    },
    {
      name: "Total Pembayaran",
      selector: (row) => `Rp ${row.totalAfterDiscount.toLocaleString()}`,
      sortable: true,
    },
    {
      name: "Tanggal Pembelian",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Detail Produk",
      cell: (row) => (
        <ul>
          {row.cart.map((item) => (
            <li key={item._id}>
              {item.productName} x{item.quantity} - Rp{" "}
              {item.totalPrice.toLocaleString()}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="body-box">
      <h3>Riwayat Pembelian</h3>
      <DataTable
        columns={columns}
        data={purchaseHistory}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
};

export default PurchaseHistory;
