import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, ""); // => http://localhost:4000

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});
