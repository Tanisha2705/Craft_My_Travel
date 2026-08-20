// src/axios.ts
// Central axios instance so every page hits the same backend base URL.
// Override with VITE_API_URL in a .env file when deploying (see .env.example).
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the saved auth token (if any) to every request.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
