<template>
  <div class="container py-4">
    <!-- Tiêu đề -->
    <h1 class="h3 mb-2">Quản lý báo cáo</h1>
    <p class="text-muted mb-4">Xem xét và xử lý các báo cáo vi phạm từ người dùng</p>
    <!-- Bộ lọc -->
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title mb-3"><i class="bi bi-funnel"></i> Bộ lọc</h5>
        <div class="row g-3">
          <div class="col-md-4">
            <input v-model="filters.search"
                   type="text"
                   class="form-control"
                   placeholder="Tìm theo lý do hoặc người báo cáo..." />
          </div>
          <div class="col-md-4">
            <select v-model="filters.status"
                    class="form-select">
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="reviewed">Đã duyệt</option>
            </select>
          </div>
          <div class="col-md-4">
            <select v-model="filters.type"
                    class="form-select">
              <option value="">Tất cả loại</option>
              <option value="question">Câu hỏi</option>
              <option value="answer">Câu trả lời</option>
              <option value="comment">Bình luận</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <!-- Hành động hàng loạt -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <label class="form-check-label"> {{ reports.length }} báo cáo </label>
    </div>
    <!-- Danh sách báo cáo -->
    <div v-if="loading"
         class="text-center">Đang tải...</div>
    <div v-else-if="reports.length === 0"
         class="text-center text-muted"> Không có báo cáo nào </div>
    <div v-else
         class="d-flex flex-column gap-3">
      <ReportCard v-for="r in reports"
                  :key="r.id"
                  v-bind="r"
                  v-model:selected="selectedReports"
                  @review="handleReview" />
    </div>
    <!-- Phân trang -->
    <div class="d-flex justify-content-center gap-2 mt-3">
      <button class="btn btn-outline-danger rounded-pill px-4"
              :disabled="page === 1"
              @click="prevPage">Trước</button>
      <span class="align-self-center fw-semibold"> Trang {{ page }} / {{ totalPages }} </span>
      <button class="btn btn-outline-danger rounded-pill px-4"
              :disabled="page >= totalPages"
              @click="nextPage">Tiếp</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useAdminApi } from "@/api/adminApi";
import ReportCard from "@/components/ReportCard.vue";
import type { ReportDto } from "./types/admin";

const api = useAdminApi();
const reports = ref<ReportDto[]>([]);
const loading = ref(true);

// Phân trang
const page = ref(1);
const limit = ref(20);
const totalReports = ref(0);
const totalPages = computed(() => Math.ceil(totalReports.value / limit.value));

// Bộ lọc
const filters = ref({
  search: "",
  status: "" as '' | 'pending' | 'reviewed',
  type: "" as '' | 'question' | 'answer' | 'comment',
});

// Chọn nhiều
const selectedReports = ref<number[]>([]);

// Lấy danh sách báo cáo
const fetchReports = async () => {
  loading.value = true;
  const res = await api.listReports({
    page: page.value,
    limit: limit.value,
    search: filters.value.search,
    status: filters.value.status || undefined,
    targetType: filters.value.type || undefined,
  });
  reports.value = res.items;
  totalReports.value = res.total;
  loading.value = false;
};

// Đánh dấu đã duyệt 1 báo cáo
const handleReview = async (id: number) => {
  await api.reviewReport(id);
  fetchReports();
};
// Theo dõi bộ lọc
watch(filters, () => {
  page.value = 1;
  fetchReports();
}, { deep: true });

// Điều khiển phân trang
const prevPage = () => {
  if (page.value > 1) {
    page.value--;
    fetchReports();
  }
};

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++;
    fetchReports();
  }
};

onMounted(fetchReports);
</script>
