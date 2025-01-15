

import axios from 'axios';

// Create an Axios instance to configure the base URL and headers
const api = axios.create({
  baseURL: 'http://localhost:3000',  // Your backend server URL
  timeout: 10000,  // Optional: Set timeout for requests in milliseconds
  headers: {
    //'Content-Type': 'application/json',  // Default header for JSON requests
    Authorization:`Bearer ${sessionStorage.getItem("token")}`,
  },
});

export default api;
