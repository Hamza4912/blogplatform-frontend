import axios from "axios";

const api = axios.create({
  baseURL: "https://hamza-blogplatform-grefh5fbetc6gzgy.eastasia-01.azurewebsites.net/api",
});

// Request interceptor: har request se pehle token attach karo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: agar 401 aaye, token refresh karo aur retry karo
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const response = await axios.post(
          "https://hamza-blogplatform-grefh5fbetc6gzgy.eastasia-01.azurewebsites.net/api/Auth/refresh",
          { refreshToken: refreshToken }
        );

        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;