import axios from "axios";

const api = axios.create({
  baseURL: "https://escout-esports-scouting-platform-1.onrender.com/api/v1/users",
  withCredentials: true,
});

export default api;
