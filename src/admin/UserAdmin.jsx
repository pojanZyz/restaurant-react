import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../js/useAuth";
import "../admin-css/admin-user.css";
import Loader from "../components/Loader";
import NoData from "../components/NoData";

const UserAdmin = () => {
  const { token, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [userCount, setUserCount] = useState(0);
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      getToken();
    }
  }, [token, debouncedSearch, sort, role, page, limit]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/user?search=${debouncedSearch}&role=${role}&sort=${sort}&page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
      setUserCount(res.data.dataCount);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  //handle delete
  const handleDelete = async (userId) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      setLoading(true);
      try {
        const res = await axios.delete(`api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "info",
          title: "Information",
          text: res.data.message,
          showConfirmButton: false,
          timer: 2000,
        });
        fetchUsers();
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
      <div className="user-admin-container quicksand">
        <div className="admin-user-con1">
          <h2 className="poppins-regular">
            <i className="bi bi-person-fill"></i> Users
          </h2>
        </div>

        <div className="admin-user-con2">
          <div className="control-panel-user">
            <div className="control-panel-user-main">
              <div className="search-input">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search user..."
                  className="quicksand"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="quicksand"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="asc">A-Z</option>
                <option value="dsc">Z-A</option>
                <option value="newest">Terbaru</option>
              </select>
              <select
                className="quicksand"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="control-panel-user-extend">
              <button
                className={
                  role === "" ? "active-btn poppins-regular" : "poppins-regular"
                }
                onClick={() => setRole("")}
              >
                <i className="bi bi-list"></i> All
              </button>
              <button
                className={
                  role === "customer"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => setRole("customer")}
              >
                Customer
              </button>
              <button
                className={
                  role === "admin"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => setRole("admin")}
              >
                Admin
              </button>
            </div>
          </div>

          {userCount === 0 ? (
            <NoData str={"No users found"} />
          ) : (
            <>
              <div className="user-count-con">
                <div>
                  <span className="poppins-regular">
                    {userCount || 0}
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <span className="span-2">USERS</span>
                </div>
                <div>
                  <i className="bi bi-columns"></i>
                  <span className="span-2">
                    Page {page} of {totalPages}
                  </span>
                </div>
              </div>

              <table className="user-table">
                <thead className="poppins-regular">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Logged In?</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.useremail}</td>
                      <td>{user.role}</td>
                      <td>{user.refreshToken ? "Yes" : "No"}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="delete-button poppins-regular"
                        >
                          <i className="bi bi-trash-fill"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  className="quicksand"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pg) => (
                  <button
                    key={pg}
                    className={`page-btn
                  ${
                    page === pg
                      ? "active-btn poppins-regular"
                      : "poppins-regular"
                  }`}
                    onClick={() => setPage(pg)}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  className="quicksand"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAdmin;
