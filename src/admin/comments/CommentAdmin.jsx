import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../../js/useAuth";
import "./admin-comment.css";
import Loader from "../../components/Loader";
import NoData from "../../components/NoData";
import CommentStat from "./CommentStat";

const CommentAdmin = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [statCount, setStatCount] = useState([]);
  const [topCommenter, setTopCommenter] = useState({});
  const [commentDate, setCommentDate] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(delay);
  }, [search]);
  useEffect(() => {
    fetchComments();
  }, [sort, status, page, limit, debouncedSearch]);
  useEffect(() => {
    fetchCommentStats();
  }, [comments]);

  //events handler
  const handleStatusChange = (statVal) => {
    setStatus(statVal);
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

  //get all comments
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/comment?sort=${sort}&limit=${limit}&page=${page}&status=${status}&search=${debouncedSearch}`
      );
      setComments(res.data.data);
      setTotalPages(res.data.totalPages);
      setCommentCount(res.data.dataCount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //get comment stats
  const fetchCommentStats = async () => {
    try {
      const res = await axios.get("api/comment-stat");
      setTopCommenter(res.data.topCommenter);
      setStatCount(res.data.statusStats);
      setCommentDate(res.data.commentDateStats);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmation = confirm("Are you sure?");
    if (confirmation) {
      setLoading(true);
      try {
        const res = await axios.delete(`api/comment/${commentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "Comment deleted",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchComments();
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

  const handleUpdateComment = async (commentId, currentStatus) => {
    setLoading(true);
    try {
      const newStatus = currentStatus === "Public" ? "Private" : "Public";
      const res = await axios.put(
        `api/comment/${commentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message || "Comment updated",
        showConfirmButton: false,
        timer: 2000,
      });
      fetchComments();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="comment-admin-container quicksand">
        <div className="admin-comment-con1">
          <h2 className="poppins-regular">
            <i className="bi bi-chat-left-dots-fill"></i> Comments
          </h2>
        </div>

        <div className="admin-menu-con2">
          <CommentStat
            comCount={commentCount}
            topCommenter={topCommenter}
            commentDateStats={commentDate}
            statCount={statCount}
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
              <option value="asc">A-Z</option>
              <option value="dsc">Z-A</option>
              <option value="oldest">Oldest</option>
            </select>
            <select
              className="quicksand"
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="">All</option>
              <option value="Private">Private</option>
              <option value="Public">Public</option>
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

          <div className="comments-wrap">
            <div className="comments-grid">
              {commentCount === 0 ? (
                <NoData str={"No comment found"} />
              ) : (
                comments.map((comment) => (
                  <div className="comment-item-grid" key={comment._id}>
                    <div className="header">
                      <div>
                        <span className="poppins-regular">
                          {comment.userInfo.username}
                        </span>
                        <span className="quicksand email">
                          {comment.userInfo.useremail}
                        </span>
                      </div>
                      <span className="date">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                      <div className="icon-access">
                        {comment.status === "Private" ? (
                          <i className="bi bi-lock-fill lock"></i>
                        ) : (
                          <i className="bi bi-globe world"></i>
                        )}
                      </div>
                    </div>
                    <div className="body">
                      <p className="quicksand">{comment.comment}</p>
                    </div>
                    <div className="footer-com">
                      <button className="poppins-regular update-com" onClick={() => handleUpdateComment(comment._id, comment.status)}>
                        Change to {comment.status === "Private" ? "Public" : "Private"} 
                      </button>
                      <button className="poppins-regular delete-com" onClick={() => handleDeleteComment(comment._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {commentCount === 0 ? (
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
  );
};

export default CommentAdmin;
