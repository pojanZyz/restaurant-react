import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import useAuth from "../js/useAuth";
import "../admin-css/admin-comment.css";
import Loader from "../components/Loader";

const CommentAdmin = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComments();
  }, [sort, status, page, limit]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `api/comment?sort=${sort}&limit=${limit}&page=${page}&status=${status}`
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

        <div className="admin-comment-con2">
          <div className="control-panel-comment">
            <div className="control-panel-comment-main">
              <select
                className="quicksand"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Oldest</option>
                <option value="newest">Newest</option>
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
            <div className="control-panel-comment-extend">
              <button
                className={
                  status === ""
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => setStatus("")}
              >
                <i className="bi bi-list"></i> All
              </button>
              <button
                className={
                  status === "Public"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => setStatus("Public")}
              >
                <i className="bi bi-globe"></i> Public
              </button>
              <button
                className={
                  status === "Private"
                    ? "active-btn poppins-regular"
                    : "poppins-regular"
                }
                onClick={() => setStatus("Private")}
              >
                <i className="bi bi-lock-fill"></i> Private
              </button>
            </div>
          </div>

          <div className="comment-count-con">
            <div>
              <span className="poppins-regular">
                {commentCount || 0}{" "}
                <i className="bi bi-chat-left-dots-fill"></i>
              </span>
              <span className="span-2">COMMENTS</span>
            </div>
            <div>
              <i className="bi bi-columns"></i>
              <span className="span-2">
                Page {page} of {totalPages}
              </span>
            </div>
          </div>
          <div className="comment-box">
            {comments.length === 0 ? (
              <div className="comment-grid-item">
                <p className="poppins-regular">No comments available</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div className="comment-grid-item" key={comment._id}>
                  <div className="comment-item-header">
                    <span className="poppins-regular comment-username">
                      <i className="bi bi-person-fill"></i>
                      {comment.userId.username}
                    </span>
                    <span
                      className={`poppins-regular ${
                        comment.status === "Public"
                          ? "status-public"
                          : "status-private"
                      }`}
                    >
                      {comment.status === "Public" ? (
                        <i className="bi bi-globe"></i>
                      ) : (
                        <i className="bi bi-lock-fill"></i>
                      )}
                    </span>
                  </div>
                  <p>{comment.comment}</p>
                  <div className="comment-item-footer">
                    <button
                      className="status-btn poppins-regular"
                      onClick={() =>
                        handleUpdateComment(comment._id, comment.status)
                      }
                    >
                      {comment.status === "Public"
                        ? "Make it private"
                        : "Make it public"}
                    </button>
                    <button
                      className="delete-btn poppins-regular"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="pagination">
          <button
            className="quicksand"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pg) => (
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
            )
          )}
          <button
            className="quicksand"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentAdmin;
