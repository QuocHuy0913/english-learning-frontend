import { fetchProfile, login, refreshTokens } from '@/api/auth'
import { decodeJwt } from 'jose'
import { defineStore } from 'pinia'
import { useNotificationStore } from './notificationStore'

interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
  status: 'active' | 'banned'
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = decodeJwt(token) as { exp?: number }
    const now = Math.floor(Date.now() / 1000)
    return !exp || exp < now
  } catch {
    return true
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState & { isAuthChecking: boolean } => ({
    user: null as User | null,
    accessToken: '',
    refreshToken: '',
    isAuthChecking: false,
  }),
  actions: {
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    },
    setUser(user: User) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    async fetchProfile() {
      const { data } = await fetchProfile()
      this.setUser(data)
    },
    logout() {
      this.user = null
      this.accessToken = ''
      this.refreshToken = ''
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      const notificationStore = useNotificationStore()
      notificationStore.reset()
    },

    async login(email: string, password: string) {
      const { data } = await login({ email, password })
      this.setTokens(data.accessToken, data.refreshToken)
      this.setUser(data.user)
      const notificationStore = useNotificationStore()
      await notificationStore.loadAll()
    },

    async checkAndRefreshToken(): Promise<boolean> {
      if (!this.accessToken || !this.refreshToken) {
        return false
      }

      // Access token còn hạn
      if (!isTokenExpired(this.accessToken)) {
        return true
      }

      // Hết hạn => thử refresh
      try {
        const { data } = await refreshTokens(this.refreshToken)
        this.setTokens(data.accessToken, data.refreshToken)
        return true
      } catch {
        return false
      }
    },

    async loadFromStorage() {
      this.isAuthChecking = true
      try {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const userStr = localStorage.getItem('user')

        if (accessToken) this.accessToken = accessToken
        if (refreshToken) this.refreshToken = refreshToken
        if (userStr) this.user = JSON.parse(userStr)

        const valid = await this.checkAndRefreshToken()
        if (!valid) {
          this.logout()
          return
        }
        await this.fetchProfile()
        const notificationStore = useNotificationStore()
        await notificationStore.loadAll()
      } catch {
        this.logout()
      } finally {
        this.isAuthChecking = false
      }
    },
  },
})
