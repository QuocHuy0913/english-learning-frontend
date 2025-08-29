<template>
  <div v-if="show"
       class="modal-backdrop">
    <div class="modal-content p-3">
      <!-- Header -->
      <div class="modal-header">
        <h5 class="modal-title">Report Details #{{ report.id }}</h5>
        <button type="button"
                class="btn-close btn-secondary"
                @click="close"></button>
      </div>
      <!-- Body -->
      <div class="modal-body">
        <!-- Type + Target ID -->
        <div class="row mb-2">
          <div class="col">
            <strong>Type:</strong>
            <div>{{ report.targetType }}</div>
          </div>
          <div class="col">
            <strong>Target ID:</strong>
            <div>{{ report.targetId }}</div>
          </div>
        </div>
        <!-- Reporter -->
        <!-- Status -->
        <div class="row mb-2">
          <div class="col">
            <strong>Reporter:</strong>
            <div>{{ report.reporter.name }} ({{ report.reporter.email }})</div>
          </div>
          <div class="col">
            <strong>Status:</strong>
            <div>
              <div class="badge"
                    :class="{
                      'bg-warning text-dark': report.status === 'pending',
                      'bg-secondary': report.status === 'reviewed'
                    }"> {{ report.status }} </div>
            </div>
          </div>
        </div>
        <!-- Reason -->
        <div class="mb-3">
          <strong>Reason:</strong>
          <textarea class="form-control mt-1"
                    rows="3"
                    disabled
                    :value="report.reason"></textarea>
        </div>
        <!-- Dates -->
        <div class="d-flex text-muted justify-content-between">
          <div>
            <strong>Created:</strong> {{ formatDate(report.created_at) }}
          </div>
          <div>
            <strong>Updated:</strong> {{ formatDate(report.updated_at) }}
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

// local state cho status
import { ref, watch } from "vue"
const status = ref(report.status)

// nếu report thay đổi thì sync lại status
watch(() => report.status, (val) => {
  status.value = val
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
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

.modal-header,
.modal-footer {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  border-top: 1px solid #ddd;
}

.modal-body {
  padding: 1rem;
}
</style>
