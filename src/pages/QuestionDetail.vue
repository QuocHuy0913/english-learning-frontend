<script lang="ts" setup>
// ... các import và biến đã có

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AnswerCard from '../components/AnswerCard.vue';
import {
  fetchQuestion,
  deleteQuestion,
  type Question,
} from '../api/questions';
import {
  fetchAnswersByQuestion,
  createAnswer,
  type Answer,
  deleteAnswer,
} from '../api/answers';
import { useAuthStore } from '../stores/auth';

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
    error.value = 'Answer content cannot be empty';
    return;
  }
  try {
    await createAnswer(questionId, { content: answerContent.value });
    answerContent.value = '';
    const res = await fetchAnswersByQuestion(questionId);
    answers.value = res.data;
  } catch {
    error.value = 'Failed to post answer. Please login.';
  }
}

// Nút update
function onUpdate() {
  router.push({ name: 'QuestionEdit', params: { id: questionId } });
}

// Nút delete
async function onDelete() {
  deleteError.value = '';
  if (!confirm('Are you sure you want to delete this question?')) {
    return;
  }
  try {
    await deleteQuestion(questionId);
    successMessage.value = 'Delete question successfully!';
    setTimeout(() => {
      router.push({ name: 'Home' });
    }, 1500); // đợi 1.5 giây rồi chuyển
  } catch {
    deleteError.value = 'Failed to delete question.';
  }
}

// Hàm xử lý xóa answer nhận answerId
async function handleDeleteAnswer(answerId: number) {
  try {
    await deleteAnswer(answerId);
    // Cập nhật lại danh sách answers sau khi xóa
    const res = await fetchAnswersByQuestion(questionId);
    answers.value = res.data;
  } catch {
    alert('Xóa câu trả lời thất bại!');
  }
}

onMounted(loadData);
</script>
<template>
  <div class="container mt-4 p-0"
       style="max-width: 720px;">
    <button class="btn btn-outline-success mb-3 fw-semibold"
            @click="router.back()">
      <i class="bi bi-arrow-left me-1"></i> Back </button>
    <div v-if="loading"
         class="text-center my-5">
      <div class="spinner-border text-success"
           role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="question"
         class="card shadow-sm mb-4 border-success border-2">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="card-title fw-bold mb-0">{{ question.title }}</h3>
          <div v-if="authStore.user?.id === question.user.id"
               class="d-flex flex-column flex-md-row gap-2">
            <button class="btn btn-success d-flex align-items-center"
                    @click="onUpdate">
              <i class="bi bi-pencil-square me-1"></i> Update </button>
            <button class="btn btn-danger d-flex align-items-center"
                    @click="onDelete">
              <i class="bi bi-trash me-1"></i> Delete </button>
          </div>
        </div>
        <div class="text-muted mb-3">
          <small>By {{ question.user.name }} — {{ new Date(question.created_at).toLocaleString() }}</small>
        </div>
        <div class="mb-4">
          <span v-for="tag in question.tags"
                :key="tag"
                class="badge bg-success text-white me-2"
                style="cursor: pointer;"
                @click="onTagClick(tag)">{{ tag }}</span>
        </div>
        <div class="mb-4"
             style="white-space: pre-line; font-size: 1.1rem;"> {{ question.content }} </div>
        <div v-if="deleteError"
             class="alert alert-danger">{{ deleteError }}</div>
      </div>
    </div>
    <!-- phần answers và post answer giữ nguyên -->
    <div v-if="question"
         class="mb-4">
      <h5 class="fw-bold mb-3">Answers ({{ answers.length }})</h5>
      <div v-if="answers.length === 0"
           class="alert alert-secondary"> No answers yet. </div>
      <div>
        <AnswerCard v-for="ans in answers"
                    :key="ans.id"
                    :answer="ans"
                    :currentUser="authStore.user"
                    @delete="handleDeleteAnswer" />
      </div>
    </div>
    <div v-if="authStore.accessToken"
         class="card p-3 mb-5 border-success border-2 shadow-sm">
      <h6 class="fw-bold mb-3">Your Answer</h6>
      <textarea class="form-control"
                rows="5"
                v-model="answerContent"
                placeholder="Write your answer here"></textarea>
      <div class="text-danger mt-2"
           v-if="error">{{ error }}</div>
      <button class="btn btn-success mt-3 px-4 fw-semibold"
              @click="submitAnswer"> Post Answer </button>
    </div>
    <div v-else
         class="text-center text-muted my-4">
      <em>Please login to post an answer.</em>
    </div>
  </div>
</template>
<style scoped>
.action-buttons button {
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.25s ease;
  cursor: pointer;
  border: none;
}

.btn-update {
  background-color: #28a745;
  color: white;
}

.btn-update:hover {
  background-color: #218838;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
}
</style>
