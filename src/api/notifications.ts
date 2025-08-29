import api from './axios'

export interface Notification {
  id: number
  title: string
  content: string
  read: boolean
  isGlobal: boolean
  user?: { id: number; name: string }
  created_at: string
  updated_at: string
}

export interface NotificationResponse {
  items: Notification[]
  total: number
}

export async function fetchNotifications(
  filter: 'all' | 'unread' | 'personal' | 'global' = 'all',
): Promise<NotificationResponse> {
  const res = await api.get('/notifications', { params: { filter } })
  return {
    items: res.data.items ?? res.data ?? [],
    total: res.data.total ?? (res.data.items ? res.data.items.length : (res.data.length ?? 0)),
  }
}

// Đọc (mark as read + trả về chi tiết) 1 notification
export async function readNotification(id: number) {
  return await api.get<Notification>(`/notifications/${id}`)
}

// Đánh dấu là đã đọc 1 notification
export async function markNotificationRead(id: number) {
  return await api.patch<Notification>(`/notifications/${id}/read`, {})
}
