<script setup lang="ts">
import { fetchNotifications, markAllNotificationsRead, markNotificationRead, type Notification } from '@/api/notifications'
import { ref, onMounted } from 'vue'

const filter = ref<'all' | 'unread' | 'personal' | 'global'>('all')
const notifications = ref<Notification[]>([])
const total = ref(0)
const unreadCount = ref(0)
const loading = ref(false)

async function loadNotifications() {
  loading.value = true
  try {
    const res = await fetchNotifications(filter.value)
    notifications.value = res.items
    total.value = res.total
    // chỉ tính số chưa đọc cho thông báo cá nhân
    unreadCount.value = res.items.filter(n => !n.read && !n.isGlobal).length
  } finally {
    loading.value = false
  }
}

async function onMarkRead(id: number) {
  await markNotificationRead(id)
  notifications.value = notifications.value.map(n =>
    n.id === id ? { ...n, read: true } : n
  )
  unreadCount.value = notifications.value.filter(n => !n.read && !n.isGlobal).length
}

async function onMarkAllRead() {
  await markAllNotificationsRead()
  notifications.value = notifications.value.map(n =>
    n.isGlobal ? n : { ...n, read: true }
  )
  unreadCount.value = 0
}

onMounted(loadNotifications)
</script>
<template>
  <div class="container my-4">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <h3 class="fw-bold mb-1">
          <i class="bi bi-bell me-2"></i> Thông báo
        </h3>
        <small class="text-muted">Luôn cập nhật với những thông báo mới nhất</small>
      </div>
      <button class="btn btn-outline-success btn-sm"
              @click="onMarkAllRead"
              :disabled="unreadCount === 0">
        <i class="bi bi-check2-all me-1"></i> Đánh dấu tất cả đã đọc </button>
    </div>
    <!-- Counters -->
    <div class="d-flex gap-3 mb-3">
      <span class="badge bg-light text-dark p-2 border">
        <i class="bi bi-bell me-1"></i> {{ total }} Tổng số </span>
      <span class="badge bg-danger p-2"
            v-if="unreadCount > 0">
        <i class="bi bi-clock me-1"></i> {{ unreadCount }} Chưa đọc </span>
    </div>
    <!-- Tabs -->
    <ul class="nav nav-pills mb-3 gap-2">
      <li class="nav-item">
        <button class="btn"
                :class="filter === 'all' ? 'btn-success' : 'btn-outline-success'"
                @click="filter = 'all'; loadNotifications()">
          <i class="bi bi-funnel me-1"></i>Tất cả ({{ total }}) </button>
      </li>
      <li class="nav-item">
        <button class="btn"
                :class="filter === 'unread' ? 'btn-success' : 'btn-outline-success'"
                @click="filter = 'unread'; loadNotifications()">
          <i class="bi bi-clock me-1"></i>Chưa đọc ({{ unreadCount }}) </button>
      </li>
      <li class="nav-item">
        <button class="btn"
                :class="filter === 'global' ? 'btn-success' : 'btn-outline-success'"
                @click="filter = 'global'; loadNotifications()">
          <i class="bi bi-globe me-1"></i> Toàn cục </button>
      </li>
      <li class="nav-item">
        <button class="btn"
                :class="filter === 'personal' ? 'btn-success' : 'btn-outline-success'"
                @click="filter = 'personal'; loadNotifications()">
          <i class="bi bi-person me-1"></i> Cá nhân </button>
      </li>
    </ul>
    <!-- List -->
    <div v-if="loading"
         class="text-center my-5">Đang tải...</div>
    <div v-else-if="notifications.length === 0"
         class="text-muted text-center my-5">Không có thông báo nào</div>
    <div v-else
         class="d-flex flex-column gap-3">
      <div v-for="n in notifications"
           :key="n.id"
           class="border rounded p-3 shadow-sm position-relative py-md-4 px-md-4">
        <!-- Check xanh chỉ cho personal -->
        <i v-if="!n.isGlobal && n.read"
           class="bi bi-check-lg text-success position-absolute top-0 end-0 m-2"></i>
        <h6 class="fw-bold mb-2"> {{ n.title }} <span v-if="!n.isGlobal && !n.read"
                class="text-danger">●</span>
        </h6>
        <div class="d-flex text-muted small mb-2">
          <span v-if="n.isGlobal"><i class="bi bi-globe"></i> Toàn cục</span>
          <span v-else><i class="bi bi-person"></i> Cá nhân</span>
          <span class="mx-2">·</span>
          <span>{{ new Date(n.created_at).toLocaleDateString() }}</span>
        </div>
        <p class="mb-0">{{ n.content }}</p>
        <!-- Nút mark read chỉ hiển thị cho personal -->
        <div v-if="!n.isGlobal && !n.read"
             class="mt-2">
          <button class="btn btn-sm btn-outline-success"
                  @click="onMarkRead(n.id)">Đánh dấu đã đọc</button>
        </div>
      </div>
    </div>
  </div>
</template>
