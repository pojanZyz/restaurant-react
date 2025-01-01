import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const getToken = async () => {
    try {
      const res = await axios.get("api/token");
      const decoded = jwtDecode(res.data.accessToken);
      setUserData({
        userId: decoded.userId,
        username: decoded.username,
        useremail: decoded.useremail,
        role: decoded.role,
      });
      setToken(res.data.accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token) {
      getToken();
    }
  }, []);

  return { token, userData, getToken };
};

export default useAuth;
