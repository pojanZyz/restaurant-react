import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import Loader from "../components/Loader";
import useAuth from "../js/useAuth";
import "../css/feedback.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const { token, userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setUseremail(userData.useremail);
    }
  }, [userData]);

  //handle comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please login first to continue",
      });
      return navigate("/login");
    }
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Confirmation",
      text: "Send the feedback?",
      showCancelButton: true,
    });
    if (confirmation.isConfirmed) {
      setLoading(true);
      try {
        const res = await axios.post(
          "api/comment",
          { username, useremail, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.message || "Reservation made successfully!",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to make reservation",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  //reset comment
  const resetComment = () => {
    setComment("");
    setUsername("");
    setUseremail("");
  };

  return (
    <div className="body-box">
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className="feedback-container quicksand">
        <div className="fb-con1">
          <h2 className="poppins-regular">
            <i className="bi bi-envelope-paper-heart-fill"></i> Feedback
          </h2>
          <p>
            Your feedback is important to us. By sharing your thoughts, you help
            us understand what works well and what can be improved, so we can
            provide a better experience for everyone!
          </p>
        </div>

        <div className="fb-con2">
          <div className="form-header">
            <h4 className="poppins-regular">Fill this form</h4>
          </div>
          <form className="feedback-form" onSubmit={handleComment}>
            <label htmlFor="username">Name</label>
            <input
              className="quicksand"
              type="text"
              id="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              className="quicksand"
              type="text"
              id="email"
              value={useremail}
              onChange={(e) => setUseremail(e.target.value)}
              maxLength={35}
              required
            />
            <label htmlFor="comment">Your feedback</label>
            <textarea
              className="quicksand"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={150}
              required
            />
            <div className="form-footer">
              <button
                type="reset"
                className="reset-btn poppins-regular"
                disabled={!username && !useremail && !comment}
                onClick={resetComment}
              >
                Reset
              </button>
              <button
                type="submit"
                className="send-btn poppins-regular"
                disabled={!comment || !username || !useremail}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
