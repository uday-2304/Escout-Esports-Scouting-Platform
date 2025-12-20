import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // will point to http://localhost:8000/api/v1/users
  withCredentials: true, 
});

export default api;
