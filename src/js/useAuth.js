import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true); // Set loading to true initially

  const getToken = async () => {
    try {
      const res = await axios.get("api/token");
      if (res.data.accessToken) {
        const decoded = jwtDecode(res.data.accessToken);
        setUserData({
          userId: decoded.userId,
          username: decoded.username,
          useremail: decoded.useremail,
          role: decoded.role,
        });
        setToken(res.data.accessToken);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setTokenLoading(false); // Ensure loading is false after the fetch
    }
  };

  useEffect(() => {
    if (!token) {
      getToken();
    } else {
      setTokenLoading(false); // Skip fetching if token is already present
    }
  }, [token]);

  return { token, userData, tokenLoading, getToken };
};

export default useAuth;
