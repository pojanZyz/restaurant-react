import React from 'react';
import DataTable from 'react-data-table-component';

const UserTable = ({ columns, filteredUser, searchUser, setSearchUser }) => {
  return (
    <div className="body-box">
      <div className="user-container">
      <section className="crud-section">
      <h3>CRUD USER</h3>
      <input
        type="text"
        placeholder="Search User"
        value={searchUser}
        onChange={e => setSearchUser(e.target.value)}
      />
      <DataTable columns={columns} data={filteredUser} title="User" pagination />
    </section>
      </div>
    </div>
  );
};

export default UserTable;
