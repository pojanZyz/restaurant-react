import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  const getToken = async () => {
    setTokenLoading(true);
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
      console.error(error);
    } finally {
      setTokenLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      getToken();
    }
  }, []);

  return { token, userData, getToken, tokenLoading };
};

export default useAuth;
