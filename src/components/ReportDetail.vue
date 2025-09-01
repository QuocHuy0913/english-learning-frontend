<template>
  <div v-if="show"
       class="modal-backdrop">
    <div class="modal-content p-3">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">Chi tiết báo cáo #{{ report.id }}</h5>
        <button type="button"
                class="btn-close btn-secondary"
                @click="close"></button>
      </div>
      <!-- Body -->
      <div class="modal-body">
        <!-- Loại + Trạng thái -->
        <div class="row mb-2">
          <div class="col">
            <strong>Đối tượng:</strong>
            <div>
              <span v-if="report.targetType === 'question'">Câu hỏi</span>
              <span v-else-if="report.targetType === 'answer'">Câu trả lời</span>
              <span v-else>Bình luận</span>
            </div>
          </div>
          <div class="col">
            <strong>Trạng thái:</strong>
            <div>
              <div class="badge"
                   :class="{
                    'bg-warning text-dark': report.status === 'pending',
                    'bg-secondary': report.status === 'reviewed'
                  }"> {{ report.status }} </div>
            </div>
          </div>
        </div>
        <!-- Người đăng target -->
        <div class="mb-2">
          <strong>Người đăng đối tượng:</strong>
          <div v-if="report.targetUser"> {{ report.targetUser.name }} ({{ report.targetUser.email }}) </div>
          <div v-else
               class="text-muted">Không xác định</div>
        </div>
        <!-- Tiêu đề / Nội dung -->
        <div v-if="report.targetTitle"
             class="mb-2">
          <strong>Tiêu đề/Nội dung:</strong>
          <div class="text-truncate">{{ report.targetTitle }}</div>
        </div>
        <!-- Người báo cáo -->
        <div class="mb-2">
          <strong>Người báo cáo:</strong>
          <div>{{ report.reporter.name }} ({{ report.reporter.email }})</div>
        </div>
        <!-- Lý do -->
        <div class="mb-3">
          <strong>Lý do:</strong>
          <textarea class="form-control mt-1"
                    rows="3"
                    disabled
                    :value="report.reason"></textarea>
        </div>
        <!-- Ngày tạo & cập nhật -->
        <div class="d-flex text-muted justify-content-between">
          <div>
            <strong>Ngày tạo:</strong> {{ formatDate(report.created_at) }}
          </div>
          <div>
            <strong>Ngày cập nhật:</strong> {{ formatDate(report.updated_at) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ReportDto } from "@/pages/Admin/types/admin"

const { report, show } = defineProps<{
  report: ReportDto
  show: boolean
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "review", id: number, newStatus: string): void
}>()

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("vi-VN")
}

const close = () => {
  emit("close")
}
</script>
<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-width: 95%;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1rem;
}
</style>
