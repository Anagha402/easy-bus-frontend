

import axios from 'axios';

//  Axios instance to configure the base URL and headers
const api = axios.create({
  baseURL: 'http://localhost:3000',  //  backend server URL
  timeout: 10000,  
  headers: {
    
    Authorization:`Bearer ${sessionStorage.getItem("token")}`,
  },
});

export default api;
