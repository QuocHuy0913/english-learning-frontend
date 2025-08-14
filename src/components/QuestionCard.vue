<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import { fetchAnswersByQuestion } from '../api/answers';

interface User {
  id: number;
  name: string;
}

interface Question {
  id: number;
  title: string;
  tags?: string[];
  user: User;
  created_at: string;
  likes?: number;
  comments?: number;
}

const props = defineProps<{ question: Question }>();
const emit = defineEmits(['select']);

const answersCount = ref<number>(0);

const onClick = () => {
  emit('select', props.question.id);
};

onMounted(async () => {
  try {
    const res = await fetchAnswersByQuestion(props.question.id);
    answersCount.value = res.data.length; // lấy tổng số câu trả lời
  } catch {
    answersCount.value = 0;
  }
});
</script>
<template>
  <div class="card shadow-sm border-0 mb-3 question-card"
       role="button"
       @click="onClick">
    <div class="card-body">
      <!-- Tiêu đề -->
      <h5 class="fw-bold mb-2">{{ question.title }}</h5>
      <!-- User + thời gian -->
      <div class="d-flex align-items-center text-muted mb-2 small">
        <i class="bi bi-person-circle me-2 fs-5 text-primary"></i>
        <span class="me-2">{{ question.user.name }}</span> • <span class="ms-2">{{ new
          Date(question.created_at).toLocaleString() }}</span>
      </div>
      <!-- Tags -->
      <div class="mb-2">
        <span v-for="tag in question.tags ?? []"
              :key="tag"
              class="badge bg-light text-dark border me-1">{{ tag }}</span>
      </div>
      <!-- Stats -->
      <div class="d-flex text-muted small">
        <div class="me-3"><i class="bi bi-hand-thumbs-up me-1"></i>{{ question.likes ?? 0 }} lượt thích</div>
        <div class="me-3"><i class="bi bi-chat-left-text me-1"></i>{{ question.comments ?? 0 }} bình luận</div>
        <div><i class="bi bi-check2-circle me-1"></i>{{ answersCount }} câu trả lời</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.question-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.question-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
</style>
