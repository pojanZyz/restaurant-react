import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../js/useAuth";

import "./admin-disc.css";
import NoData from "../../components/NoData";
import CreateDiscPopup from "./CreateDiscPopup";
import Loader from "../../components/Loader";
import UpdateDiscPopup from "./UpdateDiscPopup";
import { Helmet } from "react-helmet";
import DiscStat from "./DiscStat";

const DiscountAdmin = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const [discounts, setDiscounts] = useState([]);
  const [discountCount, setDiscountCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [limit, setLimit] = useState(30);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState({});

  const [statCount, setStatCount] = useState([]);
  const [typeCount, setTypeCount] = useState([]);
  const [nearestExp, setNearestExp] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    fetchDiscounts();
  }, [debouncedSearch, page, limit, sort, discountType]);
  useEffect(() => {
    fetchDiscountStats();
  }, [discounts]);

  //events handler
  const handleTypeChange = (catValue) => {
    setDiscountType(catValue);
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

  //handle row click
  const handleUpdatePopup = (discount) => {
    setSelectedDiscount(discount);
    setShowUpdatePopup(!showUpdatePopup);
  };

  //get all discounts
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/discount?search=${debouncedSearch}&sort=${sort}&discountType=${discountType}&page=${page}&limit=${limit}`
      );
      setDiscounts(res.data.data);
      setDiscountCount(res.data.dataCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //get disc stats
  const fetchDiscountStats = async () => {
    try {
      const res = await axios.get("api/discount-stats");
      setStatCount(res.data.statCount);
      setTypeCount(res.data.typeCount);
      setNearestExp(res.data.nearestExpiryData);
      console.log(res.data);
    } catch (error) {
      console.error("Failed to fetch best-selling products:", error);
    }
  };
  //create disc
  const handleCreateDisc = async (newDisc) => {
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Create new discount?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (confirmation.isConfirmed) {
      try {
        setLoading(true);
        setShowCreatePopup(false);
        const res = await axios.post("api/discount", newDisc, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "New discount created!",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchDiscounts();
      } catch (error) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: error.response?.data?.message || "Failed to make discount",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  //update disc
  const handleUpdateDisc = async (newDiscount) => {
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Update discount?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (confirmation.isConfirmed) {
      try {
        setLoading(true);
        setShowUpdatePopup(false);
        const data = {
          discountCode: newDiscount.discountCode,
          discountType: newDiscount.discountType,
          discountValue: newDiscount.discountValue,
          expiryDate: newDiscount.expiryDate,
          costInCoins: newDiscount.costInCoins,
        };
        const res = await axios.put(`api/discount/${newDiscount._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "Discount updated!",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchDiscounts();
      } catch (error) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: error.response?.data?.message || "Failed to make discount",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  //delete disc
  const handleDeleteDisc = async (discountId) => {
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Delete discount? This will make the record gone forever",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (confirmation.isConfirmed) {
      try {
        setLoading(true);
        setShowUpdatePopup(false);

        const res = await axios.delete(`api/discount/${discountId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "Discount deleted",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchDiscounts();
      } catch (error) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: error.response?.data?.message || "Failed to make discount",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>CafeCoding | Admin-Discounts</title>
      </Helmet>
      <div className="body-box">
        {loading && (
          <div className="loader-overlay">
            <Loader />
          </div>
        )}
        <div className="disc-admin-container quicksand">
          <div className="admin-menu-con1">
            <h2 className="poppins-regular">
              <i className="bi bi-percent judul"></i>{" "}
              <span className="judul">Discounts</span>
            </h2>
          </div>
          <div className="admin-menu-con2">
            <DiscStat
              discountCount={discountCount}
              statCount={statCount}
              typeCount={typeCount}
              nearestExp={nearestExp}
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
              <div className="page-ttl">
                <i className="bi bi-hand-index-thumb"></i>
                <span>Click each items to see details.</span>
              </div>
            </div>

            <div className="filters">
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
              <select
                className="quicksand"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="valueAsc">Value ASC</option>
                <option value="valueDsc">Value DSC</option>
              </select>
              <select
                className="quicksand"
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="">All</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
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

            <div className="users-wrap">
              <table className="user-table">
                <thead className="poppins-regular">
                  <tr>
                    <th>Discount Code</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Exp Date</th>
                    <th>CC Points</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className="add-disc"
                    onClick={() => setShowCreatePopup(!showCreatePopup)}
                  >
                    <td colSpan={6}>
                      <i className="bi bi-plus-square-dotted"></i>
                      <span className="poppins-regular">
                        Add new discount code
                      </span>
                    </td>
                  </tr>
                  {discountCount === 0 || discounts.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <NoData str={"No discount found"} />
                      </td>
                    </tr>
                  ) : (
                    discounts.map((discount) => (
                      <tr
                        key={discount._id}
                        onClick={() => handleUpdatePopup(discount)}
                      >
                        <td style={{ fontWeight: "bold" }}>
                          {discount.discountCode}
                        </td>
                        <td>
                          <span
                            className={`${
                              discount.discountType === "percentage"
                                ? "type-per"
                                : "type-fix"
                            }`}
                          >
                            {discount.discountType}
                          </span>
                        </td>
                        <td>
                          {discount.discountType === "percentage"
                            ? `${discount.discountValue}%`
                            : `Rp${discount.discountValue.toLocaleString(
                                "id-ID"
                              )}`}
                        </td>
                        <td>
                          {new Date(discount.expiryDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </td>
                        <td>{discount.costInCoins}</td>
                        <td>
                          <span
                            className={`${
                              discount.status === "Available"
                                ? "status-ava"
                                : discount.status === "Used"
                                ? "status-used"
                                : "status-exp"
                            }`}
                          >
                            {discount.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {discountCount === 0 ? (
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
        <CreateDiscPopup
          isVisible={showCreatePopup}
          onClose={() => setShowCreatePopup(false)}
          onCreate={handleCreateDisc}
        />

        <UpdateDiscPopup
          isVisible={showUpdatePopup}
          onClose={() => setShowUpdatePopup(false)}
          onUpdate={handleUpdateDisc}
          onDelete={handleDeleteDisc}
          discount={selectedDiscount}
        />
      </div>
    </>
  );
};

export default DiscountAdmin;
