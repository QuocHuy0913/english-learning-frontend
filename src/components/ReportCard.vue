<template>
  <div class="card shadow-sm border-danger report-card p-3">
    <div class="card-body">
      <div class="d-flex flex-wrap justify-content-between align-items-start mb-2">
        <!-- Bên trái -->
        <div class="d-flex flex-wrap align-items-center gap-2">
          <h5 class="mb-0">Báo cáo #{{ props.id }}</h5>
          <span class="badge bg-danger">{{ props.targetType }}</span>
          <span :class="statusBadgeClass"> {{ localStatus }} </span>
        </div>
        <!-- Bên phải -->
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-sm btn-outline-secondary"
                  @click="openDetail"
                  title="Xem chi tiết">
            <i class="bi bi-eye"></i>
          </button>
          <!-- Dropdown đổi trạng thái -->
          <div class="dropdown">
            <button class="btn btn-sm dropdown-toggle"
                    :class="statusButtonClass"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"> {{ localStatus.charAt(0).toUpperCase() + localStatus.slice(1) }} </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item"
                   href="#"
                   @click.prevent="onStatusChange('pending')">Đang chờ</a>
              </li>
              <li>
                <a class="dropdown-item"
                   href="#"
                   @click.prevent="onStatusChange('reviewed')">Đã duyệt</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p class="mb-2"><strong>Người báo cáo:</strong> {{ props.reporter.email }}</p>
      <p class="mb-2"><strong>Lý do:</strong> {{ props.reason }}</p>
      <p class="mb-2 text-muted small">Đối tượng: {{ props.targetType }} #{{ props.targetId }}</p>
      <p class="text-muted small mb-0">{{ formatDate(props.created_at) }}</p>
    </div>
  </div>
  <!-- popup Chi tiết báo cáo -->
  <transition name="fade">
    <ReportDetail v-if="showDetail"
                  :report="props"
                  :show="showDetail"
                  @close="showDetail = false"
                  @review="onReviewClick" />
  </transition>
</template>
<script setup lang="ts">
import type { ReportDto, ReportStatus } from "@/pages/Admin/types/admin";
import { computed, ref } from "vue";
import { useAdminApi } from "@/api/adminApi";
import ReportDetail from "./ReportDetail.vue";

const props = defineProps<ReportDto & { selected?: number[] }>();
const emit = defineEmits<{
  (e: "review", id: number): void;
  (e: "update:selected", value: number[] | undefined): void;
  (e: "updated", payload: { id: number; status: ReportStatus }): void;
}>();

const api = useAdminApi();

const localStatus = ref<ReportStatus>(props.status);

const statusButtonClass = computed(() =>
  localStatus.value === 'pending' ? 'btn-warning' : 'btn-secondary'
);
const statusBadgeClass = computed(() =>
  localStatus.value === 'pending' ? 'badge bg-warning text-dark' : 'badge bg-secondary'
);

const onStatusChange = async (newStatus: ReportStatus) => {
  try {
    const res = await api.updateStatusReport(props.id, newStatus);
    localStatus.value = res.status ?? newStatus;
    emit("updated", { id: props.id, status: localStatus.value });
  } catch (err) {
    console.error("Cập nhật trạng thái thất bại:", err);
    alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
  }
};

const onReviewClick = () => {
  emit("review", props.id);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN");
};

// Trạng thái popup
const showDetail = ref(false);
const openDetail = () => {
  showDetail.value = true;
};
</script>
