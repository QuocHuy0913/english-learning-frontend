import { defineStore } from 'pinia'
import {
  fetchNotifications,
  markNotificationRead,
  type Notification,
} from '@/api/notifications'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    items: [] as Notification[],
  }),
  getters: {
    unreadPersonalCount: (state) => state.items.filter((n) => !n.read && !n.isGlobal).length,
  },
  actions: {
    async loadAll() {
      const res = await fetchNotifications()
      this.items = res.items
    },
    async markAsRead(id: number) {
      try {
        await markNotificationRead(id)
        const item = this.items.find((n) => n.id === id)
        if (item) item.read = true // đổi sang read
      } catch (e) {
        console.error('Lỗi khi markAsRead:', e)
      }
    },
    reset() {
      this.items = [] // 👈 clear state khi logout
    },
  },
})
