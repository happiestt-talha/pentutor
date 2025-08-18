import axios from "axios";

const BASE_URL = "https://pen-tutor-api.onrender.com"; // change if needed

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// attach token automatically from localStorage
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("access_token");
    if (raw) config.headers.Authorization = `Bearer ${raw}`;
  } catch (e) {
    // noop
  }
  return config;
});

export default api;