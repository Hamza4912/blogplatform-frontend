import axios from "axios";

const api = axios.create({
  baseURL: "https://hamza-blogplatform-grefh5fbetc6gzgy.eastasia-01.azurewebsites.net/api",
});

// Interceptor: har request se pehle token attach karo (agar available ho)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;