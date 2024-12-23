import React from 'react';
import DataTable from 'react-data-table-component';

const PesananTable = ({ columns, filteredPesanan, searchPesanan, setSearchPesanan }) => {
  return (
    <div className="body-box">
      <div className="order-container">
      <section className="crud-section">
      <h3>CRUD PESANAN</h3>
      <input
        type="text"
        placeholder="Search Menu in Orders"
        value={searchPesanan}
        onChange={e => setSearchPesanan(e.target.value)}
      />
      <DataTable columns={columns} data={filteredPesanan} title="Pesanan" pagination />
    </section>
      </div>
    </div>
  );
};

export default PesananTable;
