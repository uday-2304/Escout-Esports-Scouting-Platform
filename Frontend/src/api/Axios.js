import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "https://escout-esports-scouting-platform-1.onrender.com") + "/api/v1/users",
  withCredentials: true,
});

export default api;
