<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchMyQuestions, deleteQuestion, type Question } from '../api/questions';
import QuestionCard from '../components/QuestionCard.vue';

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
    error.value = err?.message || 'Failed to load questions.';
  } finally {
    loading.value = false;
  }
}

function onEdit(id: number) {
  router.push({ name: 'QuestionEdit', params: { id } });
}

async function onDelete(id: number) {
  if (!confirm('Are you sure you want to delete this question?')) return;
  try {
    await deleteQuestion(id);
    questions.value = questions.value.filter(q => q.id !== id);
  } catch {
    alert('Failed to delete question.');
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
      <h3 class="mb-4 align-content-center d-flex"> <button class="btn btn-outline-success me-3 fw-semibold"
                @click="router.back()">
          <i class="bi bi-arrow-left me-1"></i> Back </button>Your Questions</h3>
      <div v-if="loading"
           class="text-center my-5">
        <div class="spinner-border text-success"
             role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-if="error"
           class="alert alert-danger">{{ error }}</div>
      <div v-if="!loading && questions.length === 0"
           class="text-center text-muted my-5"> No questions found </div>
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
                <i class="bi bi-pencil-square me-1"></i> Edit </button>
              <button class="btn btn-sm btn-outline-danger"
                      @click="onDelete(q.id)">
                <i class="bi bi-trash me-1"></i> Delete </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Pagination -->
      <div v-if="total > limit"
           class="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button class="btn btn-outline-success btn-sm"
                :disabled="page === 1"
                @click="page--; loadQuestions();">
          <i class="bi bi-chevron-left me-1"></i> Previous </button>
        <span class="fw-semibold">Page {{ page }} of {{ Math.ceil(total / limit) }}</span>
        <button class="btn btn-outline-success btn-sm"
                :disabled="page * limit >= total"
                @click="page++; loadQuestions();"> Next <i class="bi bi-chevron-right ms-1"></i>
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
