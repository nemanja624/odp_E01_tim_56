import axios from 'axios';

export const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export const SERVER_BASE = API_BASE.replace(/\/api$/, ''); 

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});
