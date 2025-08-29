<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
// eslint-disable @typescript-eslint/no-explicit-any
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchMyQuestions, deleteQuestion, type Question } from '../../api/questions';
import QuestionCard from '@/components/QuestionCard.vue';
const router = useRouter();

const questions = ref<Question[]>([]);
const loading = ref(false);
const error = ref('');
const page = ref(1);
const limit = ref(10);
const total = ref(0);

async function loadQuestions() {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetchMyQuestions(page.value, limit.value);
    questions.value = res.data.items;
    total.value = res.data.total;
  } catch (err: any) {
    error.value = err?.message || 'Không tải được câu hỏi.';
  } finally {
    loading.value = false;
  }
}

function onEdit(id: number) {
  router.push({ name: 'QuestionEdit', params: { id } });
}

async function onDelete(id: number) {
  if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
  try {
    await deleteQuestion(id);
    questions.value = questions.value.filter(q => q.id !== id);
  } catch {
    alert('Xóa câu hỏi thất bại.');
  }
}

function onSelectQuestion(id: number) {
  router.push({ name: 'QuestionDetail', params: { id } });
}

onMounted(loadQuestions);
</script>
<template>
  <div class="min-vh-100 bg-success bg-opacity-10 py-5">
    <div class="container"
         style="max-width: 800px;">
      <h3 class="mb-4 d-flex align-items-center">
        <button class="btn btn-outline-success me-3 fw-semibold"
                @click="router.back()">
          <i class="bi bi-arrow-left me-1"></i> Quay lại </button> Câu hỏi của tôi
      </h3>
      <div v-if="loading"
           class="text-center my-5">
        <div class="spinner-border text-success"
             role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
      </div>
      <div v-if="error"
           class="alert alert-danger">{{ error }}</div>
      <div v-if="!loading && questions.length === 0"
           class="text-center text-muted my-5"> Không có câu hỏi nào </div>
      <div class="row g-3">
        <div v-for="q in questions"
             :key="q.id"
             class="col-12">
          <div class="card shadow-sm p-3 border-0 hover-shadow">
            <QuestionCard :question="q"
                          @select="onSelectQuestion" />
            <div class="mt-3 d-flex justify-content-end gap-2">
              <button class="btn btn-sm btn-outline-primary"
                      @click="onEdit(q.id)">
                <i class="bi bi-pencil-square me-1"></i> Sửa </button>
              <button class="btn btn-sm btn-outline-danger"
                      @click="onDelete(q.id)">
                <i class="bi bi-trash me-1"></i> Xóa </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Phân trang -->
      <div v-if="total > limit"
           class="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button class="btn btn-outline-success btn-sm"
                :disabled="page === 1"
                @click="page--; loadQuestions();">
          <i class="bi bi-chevron-left me-1"></i> Trước </button>
        <span class="fw-semibold">Trang {{ page }} / {{ Math.ceil(total / limit) }}</span>
        <button class="btn btn-outline-success btn-sm"
                :disabled="page * limit >= total"
                @click="page++; loadQuestions();"> Sau <i class="bi bi-chevron-right ms-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.hover-shadow {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 0.5rem;
}

.hover-shadow:hover {
  transform: translateY(-3px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 128, 0, 0.2);
}
</style>
