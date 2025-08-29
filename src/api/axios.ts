import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
})

// Instance riêng để refresh token, không có interceptor
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
})

// Gửi accessToken vào tất cả request
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
        const { data } = await refreshApi.post('/auth/refresh', {
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
  },
)

export default api
