<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createQuestion } from '../api/questions';

const router = useRouter();

const title = ref('');
const content = ref('');
const tags = ref('');
const error = ref('');

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
      </div>
      <div class="mb-4">
        <label for="tags"
               class="form-label text-success fw-semibold">Tags (comma separated)</label>
        <input id="tags"
               v-model="tags"
               type="text"
               class="form-control shadow-sm"
               placeholder="e.g. self learning, ielts, toeic, english basic" />
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
