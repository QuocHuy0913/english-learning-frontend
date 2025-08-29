<script lang="ts" setup>
// ... các import và biến đã có

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchQuestion,
  deleteQuestion,
  type Question,
} from '../../api/questions';
import {
  fetchAnswersByQuestion,
  createAnswer,
  type Answer,
  deleteAnswer,
} from '../../api/answers';
import { useAuthStore } from '../../stores/auth';
import { createReport } from '@/api/reports';
import AnswerCard from '@/components/AnswerCard.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const questionId = Number(route.params.id);
const question = ref<Question | null>(null);
const answers = ref<Answer[]>([]);
const loading = ref(false);
const answerContent = ref('');
const error = ref('');
const deleteError = ref('');
const successMessage = ref('');

const showReportModal = ref(false)
const reportReason = ref('')
const reportError = ref('')
const reportSuccess = ref('')

async function loadData() {
  loading.value = true;
  try {
    const [qRes, aRes] = await Promise.all([
      fetchQuestion(questionId),
      fetchAnswersByQuestion(questionId),
    ]);
    question.value = qRes.data;
    answers.value = aRes.data;
  } catch {
    router.push({ name: 'Home' });
  } finally {
    loading.value = false;
  }
}

function onTagClick(tag: string) {
  router.push({ name: 'Home', query: { tag } });
}

async function submitAnswer() {
  error.value = '';
  if (!answerContent.value.trim()) {
    error.value = 'Nội dung câu trả lời không được để trống';
    return;
  }
  try {
    await createAnswer(questionId, { content: answerContent.value });
    answerContent.value = '';
    const res = await fetchAnswersByQuestion(questionId);
    answers.value = res.data;
  } catch {
    error.value = 'Đăng câu trả lời thất bại. Vui lòng đăng nhập.';
  }
}

// Nút update
function onUpdate() {
  router.push({ name: 'QuestionEdit', params: { id: questionId } });
}

// Nút delete
async function onDelete() {
  deleteError.value = '';
  if (!confirm('Bạn có chắc muốn xóa câu hỏi này không?')) {
    return;
  }
  try {
    await deleteQuestion(questionId);
    successMessage.value = 'Xóa câu hỏi thành công!';
    setTimeout(() => {
      router.push({ name: 'Home' });
    }, 1500); // đợi 1.5 giây rồi chuyển
  } catch {
    deleteError.value = 'Xóa câu hỏi thất bại.';
  }
}

async function handleDeleteAnswer(answerId: number) {
  try {
    await deleteAnswer(answerId);
    const res = await fetchAnswersByQuestion(questionId);
    answers.value = res.data;
  } catch {
    alert('Xóa câu trả lời thất bại!');
  }
}

function onReport() {
  if (!authStore.accessToken) {
    alert('Bạn phải đăng nhập để thực hiện báo cáo!')
    return
  }
  reportReason.value = ''
  reportError.value = ''
  reportSuccess.value = ''
  showReportModal.value = true
}

async function submitReport() {
  if (!reportReason.value.trim()) {
    reportError.value = 'Vui lòng nhập lý do báo cáo'
    return
  }
  try {
    await createReport('question', questionId, reportReason.value)
    reportSuccess.value = 'Báo cáo thành công!'
    reportError.value = ''
    setTimeout(() => {
      showReportModal.value = false
    }, 1500)
  } catch {
    reportError.value = 'Gửi báo cáo thất bại!'
  }
}

onMounted(loadData);
</script>
<template>
  <div class="container mt-4 p-0"
       style="max-width: 720px;">
    <button class="btn btn-outline-success mb-3 fw-semibold"
            @click="router.back()">
      <i class="bi bi-arrow-left me-1"></i> Quay lại </button>
    <div v-if="loading"
         class="text-center my-5">
      <div class="spinner-border text-success"
           role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    <div v-else-if="question"
         class="card shadow-sm mb-4 border-success border-2">
      <div class="card-body">
        <div class="d-flex justify-content-between mb-2">
          <h3 class="card-title fw-bold me-3">{{ question.title }}</h3>
          <div class="flex-column flex-md-row gap-2">
            <!-- Nút Sửa/Xóa: chỉ cho chính chủ -->
            <div v-if="authStore.user?.id === question.user.id"
                 class="d-flex gap-2">
              <button class="btn btn-success d-flex align-items-center"
                      @click="onUpdate">
                <i class="bi bi-pencil-square me-1"></i> Sửa </button>
              <button class="btn btn-danger d-flex align-items-center"
                      @click="onDelete">
                <i class="bi bi-trash me-1"></i> Xóa </button>
            </div>
            <!-- Nút Báo cáo: chỉ cần đăng nhập -->
            <div v-if="authStore.accessToken"
                 class="mt-2 me-0">
              <button class="btn btn-outline-danger d-flex align-items-center gap-1 px-3 py-1"
                      @click="onReport">
                <i class="bi bi-flag"></i>
                <span>Báo cáo</span>
              </button>
            </div>
          </div>
        </div>
        <div class="text-muted mb-3">
          <small>Người đăng: {{ question.user.name }} — {{ new Date(question.created_at).toLocaleString() }}</small>
        </div>
        <div class="mb-4">
          <span v-for="tag in question.tags"
                :key="tag.id"
                class="badge bg-success text-white me-2"
                style="cursor: pointer;"
                @click="onTagClick(tag.name)">{{ tag.name }}</span>
        </div>
        <div class="mb-4"
             style="white-space: pre-line; font-size: 1.1rem;"> {{ question.content }} </div>
        <div v-if="deleteError"
             class="alert alert-danger">{{ deleteError }}</div>
      </div>
    </div>
    <!-- phần answers -->
    <div v-if="question"
         class="mb-4">
      <h5 class="fw-bold mb-3">Các câu trả lời ({{ answers.length }})</h5>
      <div v-if="answers.length === 0"
           class="alert alert-secondary">Chưa có câu trả lời nào.</div>
      <div>
        <AnswerCard v-for="ans in answers"
                    :key="ans.id"
                    :answer="ans"
                    :currentUser="authStore.user"
                    @delete="handleDeleteAnswer" />
      </div>
    </div>
    <!-- form post answer -->
    <div v-if="authStore.accessToken"
         class="card p-3 mb-5 border-success border-2 shadow-sm">
      <h6 class="fw-bold mb-3">Câu trả lời của bạn</h6>
      <textarea class="form-control"
                rows="5"
                v-model="answerContent"
                placeholder="Viết câu trả lời tại đây"></textarea>
      <div class="text-danger mt-2"
           v-if="error">{{ error }}</div>
      <button class="btn btn-success mt-3 px-4 fw-semibold"
              @click="submitAnswer">Đăng câu trả lời</button>
    </div>
    <div v-else
         class="text-center text-muted my-4">
      <em>Vui lòng đăng nhập để đăng câu trả lời.</em>
    </div>
  </div>
  <!-- Modal Report -->
  <div class="modal fade show"
       tabindex="-1"
       style="display: block; background: rgba(0,0,0,0.5);"
       v-if="showReportModal">
    <div class="modal-dialog">
      <div class="modal-content border-danger">
        <div class="modal-header">
          <h5 class="modal-title">Báo cáo câu hỏi</h5>
          <button type="button"
                  class="btn-close"
                  @click="showReportModal = false"></button>
        </div>
        <div class="modal-body">
          <textarea class="form-control"
                    rows="4"
                    v-model="reportReason"
                    placeholder="Nhập lý do báo cáo..."></textarea>
          <div v-if="reportError"
               class="text-danger mt-2">{{ reportError }}</div>
          <div v-if="reportSuccess"
               class="text-success mt-2">{{ reportSuccess }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary"
                  @click="showReportModal = false">Hủy</button>
          <button class="btn btn-danger"
                  @click="submitReport">Gửi báo cáo</button>
        </div>
      </div>
    </div>
  </div>
</template>
