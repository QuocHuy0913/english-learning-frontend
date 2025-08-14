<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { createQuestion } from '../api/questions';
import { getAiSuggestion } from '@/api/ai';
import { debounce } from 'lodash';

interface AiSuggestion {
  title: string;
  content: string;
  tags: string;
}

const router = useRouter();

const title = ref('');
const content = ref('');
const tags = ref('');
const error = ref('');
const aiSuggestion = ref<AiSuggestion>({ title: '', content: '', tags: '' });
const isLoadingSuggestion = ref(false);

const fetchSuggestion = debounce(async (text: string) => {
  if (!text.trim()) {
    aiSuggestion.value = { title: '', content: '', tags: '' };
    return;
  }

  isLoadingSuggestion.value = true;
  try {
    const response = await getAiSuggestion(text); // đảm bảo API trả về { suggestion: string }
    aiSuggestion.value = response.data;
  } catch (err) {
    console.error('AI suggestion failed', err);
    aiSuggestion.value = { title: '', content: '', tags: '' };
  } finally {
    isLoadingSuggestion.value = false;
  }
}, 500);

watch([title, content, tags], ([newTitle, newContent, newTags]) => {
  const combined = [newTitle, newContent, newTags].filter(Boolean).join(' ');
  fetchSuggestion(combined);
});


async function submit() {
  error.value = '';

  const cleanTitle = title.value.trim();
  const cleanContent = content.value.trim();
  const cleanTags = tags.value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .join(',');

  if (!cleanTitle || !cleanContent) {
    error.value = 'Title and content are required';
    return;
  }
  try {
    await createQuestion({
      title: cleanTitle,
      content: cleanContent,
      tags: cleanTags || '',
    });
    router.push({ name: 'Home' });
  } catch (err) {
    console.error(err);
    error.value = 'Failed to create question. Please try again.';
  }
}
</script>
<style scoped>
/* Hover effect for button */
.btn-success:hover {
  background-color: #2e7d32;
  /* xanh đậm hơn */
  box-shadow: 0 8px 20px rgba(3, 101, 26, 0.5);
  transform: translateY(-3px);
  transition: all 0.3s ease;
}

/* Smooth transition for button */
.btn-success {
  transition: all 0.3s ease;
}
</style>
<template>
  <div class="container mt-5 p-4 rounded bg-light shadow border-1 border-primary"
       style="max-width: 720px;">
    <h3 class="text-success fw-bold mb-4 text-center">Create New Question</h3>
    <form @submit.prevent="submit"
          novalidate>
      <div class="mb-4">
        <label for="title"
               class="form-label text-success fw-semibold">Title</label>
        <input id="title"
               v-model="title"
               type="text"
               class="form-control shadow-sm"
               placeholder="Enter question title"
               required />
        <div v-if="aiSuggestion.title"
             class="text-muted fst-italic mt-1"> AI Suggestion: {{ aiSuggestion.title }} <button type="button"
                  class="btn btn-sm btn-outline-success ms-2"
                  @click="title = aiSuggestion.title">Use</button>
        </div>
      </div>
      <div class="mb-4">
        <label for="content"
               class="form-label text-success fw-semibold">Content</label>
        <textarea id="content"
                  v-model="content"
                  rows="6"
                  class="form-control shadow-sm"
                  placeholder="Describe your question in detail"
                  required></textarea>
        <div v-if="aiSuggestion.content"
             class="text-muted fst-italic mt-1"> AI Suggestion: {{ aiSuggestion.content }} <button type="button"
                  class="btn btn-sm btn-outline-success ms-2"
                  @click="content = aiSuggestion.content">Use</button>
        </div>
      </div>
      <div class="mb-4">
        <label for="tags"
               class="form-label text-success fw-semibold">Tags (comma separated)</label>
        <input id="tags"
               v-model="tags"
               type="text"
               class="form-control shadow-sm"
               placeholder="e.g. self learning, ielts, toeic, english basic" />
        <div v-if="aiSuggestion.tags"
             class="text-muted fst-italic mt-1"> AI Suggestion: {{ aiSuggestion.tags }} <button type="button"
                  class="btn btn-sm btn-outline-success ms-2"
                  @click="tags = aiSuggestion.tags">Use</button>
        </div>
      </div>
      <div v-if="error"
           class="text-danger fw-semibold text-center mb-3">{{ error }}</div>
      <button type="submit"
              class="btn btn-success fw-semibold w-100 py-2"> Create </button>
      <button class="btn btn-outline-success w-100 mt-3 fw-semibold"
              @click="router.back()">
        <i class="bi bi-arrow-left me-1"></i> Back </button>
    </form>
  </div>
</template>
