<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import { fetchAnswersByQuestion } from '../api/answers';

interface User {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Question {
  id: number;
  title: string;
  content?: string;
  tags?: Tag[];
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
    answersCount.value = res.data.length;
  } catch {
    answersCount.value = 0;
  }
});
</script>
<template>
  <div class="card mb-3 shadow-sm border-start border question-card"
       role="button"
       @click="onClick">
    <div class="card-body">
      <!-- Tiêu đề -->
      <h5 class="card-title fw-bold mb-2 text-dark">{{ question.title }}</h5>
      <!-- Nội dung ngắn -->
      <p v-if="question.content"
         class="card-text text-muted small excerpt mb-2"> {{ question.content }} </p>
      <!-- User + thời gian -->
      <div class="d-flex align-items-center mb-2 text-muted small">
        <div class="avatar me-2">
          <i class="bi bi-person-fill text-white"></i>
        </div>
        <span class="fw-semibold">{{ question.user.name }}</span>
        <span class="ms-2">• {{ new Date(question.created_at).toLocaleString() }}</span>
      </div>
      <!-- Tags -->
      <div class="mb-3">
        <span v-for="tag in question.tags ?? []"
              :key="tag.id"
              class="badge text-dark fw-semibold border border-success-subtle me-2"> {{ tag.name }} </span>
      </div>
      <!-- Stats -->
      <div class="d-flex gap-3 text-muted small">
        <div><i class="bi bi-hand-thumbs-up me-1 text-success"></i>{{ question.likes ?? 0 }} thích</div>
        <div><i class="bi bi-check2-circle me-1 text-success"></i>{{ answersCount }} trả lời</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Chỉ giữ lại những gì Bootstrap không có */
.question-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

/* Avatar user */
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #6b7280;
  /* xám */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

/* Giới hạn nội dung 2 dòng */
.excerpt {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
