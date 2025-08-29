import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend URL
  timeout: 5000,
})

// Thêm interceptor gửi token vào header
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    if (error.response?.status === 401 && !originalRequest._retry && authStore.refreshToken) {
      originalRequest._retry = true
      try {
        const { data } = await api.post('/auth/refresh', {
          refreshToken: authStore.refreshToken,
        })
        authStore.setTokens(data.accessToken, data.refreshToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch {
        authStore.logout()
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)

export default api
