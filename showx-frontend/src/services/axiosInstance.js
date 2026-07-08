import axios from "axios";

// Backend ka base URL - .env se aayega, warna localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // JWT cookie automatically har request ke saath jayegi
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
