import axios from "axios"

const api = axios.create({
  baseURL: "https://mercadinho-los-chicos-backend.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      // Redirect to login in Vue.js app
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    }
    return Promise.reject(error)
  },
)

export { api }
export default api
