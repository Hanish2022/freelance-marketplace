import axios from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Only redirect to login if not already on login page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.removeItem("token");
        delete Axios.defaults.headers.common["Authorization"];
        window.location.href = "/login";
      }
    }
    
    // Log other errors for debugging
    if (error.response?.status !== 401) {
      console.error("API Error:", error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default Axios;
