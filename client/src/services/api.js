import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored && stored.token) {
      config.headers.Authorization = `Bearer ${stored.token}`;
    }
  } catch {
    // ignore a corrupted value
  }
  return config;
});

export default api;