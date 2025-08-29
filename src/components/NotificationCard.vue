<script setup lang="ts">
import type { AdminNotification } from '@/pages/Admin/types/admin';

defineProps<{
  notification: AdminNotification
  onEdit?: (n: AdminNotification) => void
  onDelete?: (id: number) => void
}>()
</script>
<template>
  <div class="noti-card border bg-white rounded-3 p-3 mb-3">
    <div class="d-flex justify-content-between align-items-start">
      <!-- BÊN TRÁI: tiêu đề + nhãn -->
      <div class="pe-3">
        <div class="mb-2 d-flex align-items-center flex-wrap gap-2">
          <span class="fw-semibold fs-5">{{ notification.title }}</span>
          <!-- Global/User badge -->
          <span v-if="notification.isGlobal"
                class="badge rounded-pill bg-dark d-inline-flex align-items-center">
            <i class="bi bi-globe me-1"></i> Toàn hệ thống </span>
          <span v-else
                class="badge rounded-pill bg-secondary d-inline-flex align-items-center">
            <i class="bi bi-people me-1"></i> Người dùng </span>
          <!-- Read/Unread badge -->
          <span v-if="notification.read"
                class="badge rounded-pill bg-secondary d-inline-flex align-items-center">
            <i class="bi bi-envelope-open me-1"></i> Đã đọc </span>
          <span v-else
                class="badge rounded-pill bg-danger d-inline-flex align-items-center">
            <i class="bi bi-envelope-fill me-1"></i> Chưa đọc </span>
        </div>
        <!-- Nội dung -->
        <p class="text-muted mb-2">Nội dung: {{ notification.content }}</p>
        <!-- Meta -->
        <small class="text-muted d-block"> Ngày tạo: {{ new Date(notification.created_at).toLocaleDateString("vi-VN") }}
        </small>
        <small v-if="!notification.isGlobal && notification.user"
               class="text-muted d-block"> Người nhận: {{ notification.user.name }} ({{ notification.user.email }})
        </small>
      </div>
      <!-- BÊN PHẢI: hành động -->
      <div class="d-flex align-items-start gap-2">
        <button type="button"
                class="btn btn-outline-secondary btn-sm btn-icon"
                @click="onEdit?.(notification)"
                title="Chỉnh sửa">
          <i class="bi bi-pencil"></i>
        </button>
        <button type="button"
                class="btn btn-outline-secondary btn-sm btn-icon"
                @click="onDelete?.(notification.id)"
                title="Xóa">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.noti-card {
  border-color: #e9ecef;
}

.btn-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: .6rem;
}
</style>
