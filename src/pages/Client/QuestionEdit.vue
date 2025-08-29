<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchQuestion, updateQuestion } from '../../api/questions';

const router = useRouter();
const route = useRoute();

const id = Number(route.params.id);
const title = ref('');
const content = ref('');
const tags = ref('');
const error = ref('');

async function loadQuestion() {
  try {
    const res = await fetchQuestion(id);
    title.value = res.data.title;
    content.value = res.data.content;
    tags.value = res.data.tags.join(', ');
  } catch {
    router.push({ name: 'Home' });
  }
}

async function submit() {
  error.value = '';
  if (!title.value.trim() || !content.value.trim()) {
    error.value = 'Tiêu đề và nội dung không được để trống';
    return;
  }
  try {
    await updateQuestion(id, { title: title.value, content: content.value, tags: tags.value });
    router.push({ name: 'QuestionDetail', params: { id } });
  } catch {
    error.value = 'Cập nhật câu hỏi thất bại.';
  }
}

onMounted(loadQuestion);
</script>
<template>
  <div class="container mt-3"
       style="max-width: 720px;">
    <h3 class="text-success fw-bold mb-4 text-center">Chỉnh sửa câu hỏi</h3>
    <form @submit.prevent="submit"
          novalidate>
      <div class="row g-4">
        <div class="col-12 col-md-6">
          <label for="title"
                 class="form-label text-success fw-semibold">Tiêu đề</label>
          <input id="title"
                 v-model="title"
                 type="text"
                 class="form-control shadow-sm"
                 placeholder="Nhập tiêu đề câu hỏi"
                 required />
        </div>
        <div class="col-12 col-md-6">
          <label for="tags"
                 class="form-label text-success fw-semibold">Tags (phân cách bằng dấu phẩy)</label>
          <input id="tags"
                 v-model="tags"
                 type="text"
                 class="form-control shadow-sm"
                 placeholder="ví dụ: self learning, ielts, toeic, english basic" />
        </div>
        <div class="col-12">
          <label for="content"
                 class="form-label text-success fw-semibold">Nội dung</label>
          <textarea id="content"
                    v-model="content"
                    rows="6"
                    class="form-control shadow-sm"
                    placeholder="Mô tả chi tiết câu hỏi của bạn"
                    required></textarea>
        </div>
      </div>
      <div v-if="error"
           class="text-danger fw-semibold text-center my-3">{{ error }}</div>
      <button type="submit"
              class="btn btn-success fw-semibold w-100 py-2 mt-3">Cập nhật</button>
      <button class="btn btn-outline-success mt-3 w-100 fw-semibold"
              @click="router.back()">
        <i class="bi bi-arrow-left me-1"></i> Quay lại </button>
    </form>
  </div>
</template>
