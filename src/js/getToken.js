import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const getToken = async () => {
    try {
        const res = await axios.get('https://cafemdn-api.vercel.app/api/token')
        const decoded = jwtDecode(res.data.accessToken)
        return {
            userId: decoded._id,
            username: decoded.username,
            useremail: decoded.useremail,
            role: decoded.role
        }
    } catch (error) {
        return error.response.data.message
    }
}