<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import QuestionCard from '../components/QuestionCard.vue';
import { fetchQuestions, type Question } from '../api/questions';

const router = useRouter();
const route = useRoute();
const questions = ref<Question[]>([]);
const search = ref('');
const loading = ref(false);
const page = ref(1);
const total = ref(0);
const limit = 10;

async function loadQuestions() {
  loading.value = true;
  try {
    const res = await fetchQuestions(page.value, limit, search.value);
    questions.value = res.data.items;
    total.value = res.data.total;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.query.tag,
  (newTag) => {
    if (typeof newTag === 'string' && newTag.trim().length > 0) {
      search.value = newTag.trim();
      page.value = 1;
      loadQuestions();
    }
  },
  { immediate: true }
);

function onSearch() {
  page.value = 1;
  loadQuestions();
}

function onSelectQuestion(id: number) {
  router.push({ name: 'QuestionDetail', params: { id } });
}

function prevPage() {
  if (page.value > 1) {
    page.value--;
    loadQuestions();
  }
}

function nextPage() {
  const totalPages = Math.ceil(total.value / limit);
  if (page.value < totalPages) {
    page.value++;
    loadQuestions();
  }
}

onMounted(loadQuestions);

</script>
<template>
  <div class="bg-success bg-opacity-10 min-vh-100">
    <!-- Hero -->
    <div class="text-center py-5 bg-opacity-25">
      <div class="container">
        <h1 class="fw-bold display-5 mb-3">Join Our Community of English Learners!</h1>
        <p class="text-muted fs-5 mb-4"> Ask, answer, and grow together. Connect with fellow learners and native
          speakers to improve your English skills. </p>
        <!-- Stats -->
        <div class="d-flex justify-content-center gap-5 mb-4 flex-wrap">
          <div>
            <i class="bi bi-people text-success fs-4"></i>
            <h4 class="fw-bold text-success mb-0">2,847</h4>
            <small class="text-muted">Active Learners</small>
          </div>
          <div>
            <i class="bi bi-chat-left-text text-success fs-4"></i>
            <h4 class="fw-bold text-success mb-0">1,293</h4>
            <small class="text-muted">Questions Answered</small>
          </div>
          <div>
            <i class="bi bi-star text-success fs-4"></i>
            <h4 class="fw-bold text-success mb-0">4.8</h4>
            <small class="text-muted">Community Rating</small>
          </div>
        </div>
        <!-- Search -->
        <div class="input-group search-bar shadow-lg mx-auto rounded-pill overflow-hidden border border-2 border-success"
             style="max-width: 500px;">
          <span class="input-group-text bg-white border-0">
            <i class="bi bi-search fs-5 text-secondary"></i>
          </span>
          <input type="text"
                 class="form-control border-0 fs-5 py-3"
                 placeholder="Search questions..."
                 v-model="search"
                 @keyup.enter="onSearch">
        </div>
      </div>
    </div>
    <!-- Questions -->
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold">Recent Questions</h4>
        <small class="text-muted">{{ total }} questions found</small>
      </div>
      <div v-if="loading"
           class="text-center my-5">Loading...</div>
      <div v-else-if="questions.length === 0"
           class="text-center my-5 text-muted"> No questions found </div>
      <div v-else
           class="row g-3">
        <div class="col-12"
             v-for="q in questions"
             :key="q.id">
          <QuestionCard :question="q"
                        @select="onSelectQuestion" />
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center align-items-center gap-3 my-4">
      <button class="btn btn-outline-success"
              @click="prevPage"
              :disabled="page === 1"> Previous </button>
      <span>Page {{ page }} of {{ Math.ceil(total / limit) }}</span>
      <button class="btn btn-outline-success"
              @click="nextPage"
              :disabled="page >= Math.ceil(total / limit)"> Next </button>
    </div>
    <!-- Footer CTA -->
    <div class="container my-5">
      <div class="card border-0 shadow-sm rounded-4 text-center p-4 bg-opacity-25">
        <h4 class="fw-bold mb-3">Connect with Others</h4>
        <p class="text-muted"> Share your journey, learn from peers, and build lasting connections in our supportive
          English learning community. </p>
        <button class="btn btn-success rounded-pill px-4 fw-semibold"> Join a Discussion </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.input-group .form-control:focus {
  box-shadow: none;
  outline: none;
}

.input-group:focus-within {
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
  border-radius: 50px;
}

.search-bar {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.search-bar:focus-within {
  transform: scale(1.02);
  box-shadow: 0 0.5rem 1rem rgba(0, 128, 0, 0.2);
}
</style>
