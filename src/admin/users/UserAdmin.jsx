import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../../js/useAuth";
import "./admin-user.css";
import Loader from "../../components/Loader";
import NoData from "../../components/NoData";
import UserStat from "./UserStat";
import { Helmet } from "react-helmet";

const UserAdmin = () => {
  const { token, tokenLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [userCount, setUserCount] = useState(0);
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState(30);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const [roleCount, setRoleCount] = useState([]);
  const [mostCoins, setMostCoins] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if(!token || tokenLoading){
      return;
    }
    fetchUsers();
  }, [token, tokenLoading, debouncedSearch, sort, role, page, limit]);
  useEffect(() => {
    fetchUserStats();
  }, [users]);

  //events handler
  const handleRoleChange = (roleValue) => {
    setRole(roleValue);
    setPage(1);
  };
  const handleSearchChange = (searchVal) => {
    setSearch(searchVal);
    setPage(1);
  };
  const handleLimitChange = (limitVal) => {
    setLimit(limitVal);
    setPage(1);
  };

  //get all users
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

  //get user stats
  const fetchUserStats = async () => {
    try {
      const res = await axios.get("api/user-stats");
      setRoleCount(res.data.roleCount);
      setMostCoins(res.data.mostCoins);
    } catch (error) {
      console.error("Failed to fetch best-selling products:", error);
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
    <>
      <Helmet>
        <title>CafeCoding | Admin-Users</title>
      </Helmet>
      <div className="body-box">
        {loading && (
          <div className="loader-overlay">
            <Loader />
          </div>
        )}
        <div className="user-admin-container quicksand">
          <div className="admin-user-con1">
            <h2 className="poppins-regular">
              <i className="bi bi-person-fill"></i> <span>Users</span>
            </h2>
          </div>

          <div className="admin-menu-con2">
            <UserStat
              userCount={userCount}
              mostCoins={mostCoins}
              roleCount={roleCount}
            />
          </div>

          <div className="admin-menu-con3">
            <div className="table-det">
              <div className="page-ttl">
                <i className="bi bi-columns"></i>
                <span className="span-2">
                  Page {page} of {totalPages}
                </span>
              </div>
            </div>

            <div className="cas-filters">
              <div className="search-input">
                <i className="bi bi-search"></i>
                <input
                  className="quicksand"
                  type="search"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search..."
                />
              </div>
              <div className="other-filt">
                <select
                  className="quicksand"
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="asc">A-Z</option>
                  <option value="dsc">Z-A</option>
                  <option value="oldest">Oldest</option>
                </select>
                <select
                  className="quicksand"
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                  <option value="cashier">Cashier</option>
                </select>
                <select
                  className="quicksand"
                  onChange={(e) => handleLimitChange(e.target.value)}
                >
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="80">80</option>
                </select>
              </div>
            </div>

            <div className="users-wrap">
              <table className="user-table">
                <thead className="poppins-regular">
                  <tr>
                    <th>Username</th>
                    <th>Useremail</th>
                    <th>Phone Number</th>
                    <th>Role</th>
                    <th>CC Points</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userCount === 0 || users.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <NoData str={"No user found"} />
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.useremail}</td>
                        <td>
                          <span
                            className={`${
                              user.phoneNumber == null ? "empty-lbl" : ""
                            }`}
                          >
                            {user.phoneNumber || "Empty"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`poppins-regular ${
                              user.role === "admin"
                                ? "rl-admin"
                                : user.role === "cashier"
                                ? "rl-cashier"
                                : "rl-customer"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>{user.loyaltyCoins}</td>
                        <td>
                          <button
                            className="delete-button poppins-regular"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {userCount === 0 ? (
                ""
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAdmin;
